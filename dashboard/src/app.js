import React, { useMemo, useState } from 'react';
import Navbar from './Components/navbar';
import Home from './Components/home';
import Footer from './Components/footer';
import ImportModal from './Components/importModal';
import { calculateStockAnalytics } from './utils/tradeCalculations';
import { parseGrowwExcel } from './utils/excelParser';
import { TEST_CMP } from './data/testCmp';
import { SAMPLE_BROKER_CSV, SAMPLE_CMP_CSV } from './data/sampleData';

// Both import formats produce the same dashboard row structure.
function getCategory(stock) {
  if (stock.status === 'INCOMPLETE') return 'incomplete';
  if (!stock.totalSoldQty) return 'holding';
  if (stock.currentPrice == null || stock.averageSellPrice == null) return 'unknown';
  if (stock.currentPrice > stock.averageSellPrice * 1.05) return 'early';
  if (stock.realizedPnL < 0) return 'cutloss';
  return 'optimal';
}

function toDashboardTrade(stock) {
  return {
    ...stock,
    id: `STOCK-${stock.symbol}`,
    category: getCategory(stock)
  };
}

// Existing custom CSV format describes paired, completed trades.
function parseTrades(brokerText, cmpText) {
  const cmpMap = new Map();
  cmpText.trim().split('\n').slice(1).forEach((line) => {
    const [symbol, cmp] = line.split(',').map((s) => s.trim());
    if (symbol) cmpMap.set(symbol.toUpperCase(), Number(cmp));
  });

  return brokerText.trim().split('\n').slice(1).map((line, idx) => {
    const [rawSymbol, name, qty, buy, sell, buyDate, sellDate] =
      line.split(',').map((s) => s.trim());
    if (!rawSymbol) return null;
    const symbol = rawSymbol.toUpperCase();
    const quantity = Number(qty);
    const buyPrice = Number(buy);
    const sellPrice = Number(sell);
    const currentPrice = cmpMap.get(symbol);

    if (![buyPrice, sellPrice, currentPrice].every((v) => Number.isFinite(v) && v > 0)) {
      throw new Error(`Invalid or missing price data for ${symbol}`);
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error(`Invalid quantity for ${symbol}`);
    }

    const soldCost = buyPrice * quantity;
    const realizedPnL = (sellPrice - buyPrice) * quantity;
    const missedProfit = Math.max(0, (currentPrice - sellPrice) * quantity);
    const lossAvoided = Math.max(0, (sellPrice - currentPrice) * quantity);
    const averageGraph = [
      { label: 'Avg Buy', price: buyPrice, type: 'BUY', qty: quantity },
      { label: 'Avg Sell', price: sellPrice, type: 'SELL', qty: quantity },
      { label: 'CMP', price: currentPrice, type: 'CMP' }
    ];
    const transactionGraph = [
      { label: 'Buy 1', price: buyPrice, type: 'BUY', qty: quantity, startDate: buyDate, endDate: buyDate, orderCount: 1 },
      { label: 'Sell 1', price: sellPrice, type: 'SELL', qty: quantity, startDate: sellDate, endDate: sellDate, orderCount: 1 },
      { label: 'CMP', price: currentPrice, type: 'CMP' }
    ];
    const stock = {
      id: `TRD-${idx + 101}`, symbol, name: name || symbol,
      totalBoughtQty: quantity, totalSoldQty: quantity,
      matchedSoldQty: quantity, holdingQty: 0, holdingCost: 0,
      averageBuyPrice: buyPrice, averageSellPrice: sellPrice,
      averageSoldBuyPrice: buyPrice, averageHoldingPrice: null,
      currentPrice, soldCost, matchedSellValue: sellPrice * quantity,
      realizedPnL, unrealizedPnL: 0, totalPnL: realizedPnL,
      realizedReturn: realizedPnL / soldCost * 100,
      unrealizedReturn: null, holdingValue: 0,
      missedProfit, lossAvoided, unmatchedSellQty: 0,
      status: 'FULLY EXITED', averageGraph, transactionGraph
    };
    return { ...stock, category: getCategory(stock) };
  }).filter(Boolean);
}

// KPIs use all rows, not just the filtered table.
function buildPortfolioMetrics(trades) {
  const exited = trades.filter((t) => t.status === 'FULLY EXITED');
  const wins = exited.filter((t) => t.realizedPnL > 0).length;
  const losses = exited.filter((t) => t.realizedPnL < 0).length;
  const breakEven = exited.length - wins - losses;
  const sold = trades.filter((t) => t.totalSoldQty > 0);
  const pricedSales = sold.filter((t) => t.missedProfit != null && t.status !== 'INCOMPLETE');
  const incompleteCount = trades.filter((t) => t.status === 'INCOMPLETE').length;
  const totalRealized = trades.reduce((sum, t) => sum + t.realizedPnL, 0);
  const totalMissed = pricedSales.length || !sold.length
    ? pricedSales.reduce((sum, t) => sum + t.missedProfit, 0)
    : null;
  const fullCoverage = pricedSales.length === sold.length && incompleteCount === 0;
  return {
    totalRealized, totalMissed, totalTrades: exited.length,
    wins, losses, breakEven, incompleteCount,
    winRate: exited.length ? Math.round(wins / exited.length * 100) : null,
    oppRatio: fullCoverage && totalMissed != null && totalRealized !== 0
      ? Math.round(totalMissed / Math.abs(totalRealized) * 100) : null,
    pricedSalesCount: pricedSales.length,
    soldCount: sold.length,
    fullCoverage
  };
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [tableFilter, setTableFilter] = useState('all');
  const [selectedId, setSelectedId] = useState('');
  const [rawTransactions, setRawTransactions] = useState([]);
  const [isExcelMode, setIsExcelMode] = useState(false);
  const [cmpData, setCmpData] = useState(TEST_CMP);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExcelLoading, setIsExcelLoading] = useState(false);
  const [brokerFileName, setBrokerFileName] = useState('Zerodha_Trades_Q1.csv (demo)');
  const [cmpFileName, setCmpFileName] = useState('Demo CMP (sample)');
  const [priceSource, setPriceSource] = useState('Demo prices — not live');
  const [csvTrades, setCsvTrades] = useState(() => parseTrades(SAMPLE_BROKER_CSV, SAMPLE_CMP_CSV));

  // Future market API only needs to update cmpData.
  const trades = useMemo(() => isExcelMode
    ? calculateStockAnalytics(rawTransactions, cmpData).map(toDashboardTrade)
    : csvTrades, [isExcelMode, rawTransactions, cmpData, csvTrades]);

  const summaryMetrics = useMemo(() => buildPortfolioMetrics(trades), [trades]);

  const filteredTrades = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return trades.filter((t) => {
      const matchesSearch = t.symbol.toLowerCase().includes(q) || (t.name || '').toLowerCase().includes(q);
      return matchesSearch && (tableFilter === 'all' || t.category === tableFilter);
    });
  }, [trades, searchQuery, tableFilter]);

  // Never show a stock that is hidden by the current search/filter.
  const selectedTrade = filteredTrades.find((t) => t.id === selectedId) || filteredTrades[0];

  const resetSelection = () => {
    setSelectedId('');
    setSearchQuery('');
    setTableFilter('all');
    setActiveTab('overview');
  };

  const testExcelUpload = async (e) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;
    setIsExcelLoading(true);
    try {
      const transactions = await parseGrowwExcel(file);
      const analytics = calculateStockAnalytics(transactions, TEST_CMP);
      if (!analytics.length) throw new Error('No valid stock analytics found.');
      setRawTransactions(transactions);
      setCmpData(TEST_CMP);
      setIsExcelMode(true);
      setBrokerFileName(file.name);
      setCmpFileName('Test CMP (fictional)');
      setPriceSource('Test CMP — fictional, not live');
      resetSelection();
    } catch (error) {
      console.error('Excel import failed:', error);
      alert(error.message || 'Failed to import Excel file.');
    } finally {
      input.value = '';
      setIsExcelLoading(false);
    }
  };

  const handleReset = () => {
    if (isExcelLoading) return;
    setRawTransactions([]);
    setCmpData(TEST_CMP);
    setIsExcelMode(false);
    setCsvTrades(parseTrades(SAMPLE_BROKER_CSV, SAMPLE_CMP_CSV));
    setBrokerFileName('Zerodha_Trades_Q1.csv (demo)');
    setCmpFileName('Demo CMP (sample)');
    setPriceSource('Demo prices — not live');
    resetSelection();
  };

  const handleImportClick = () => {
    if (!isExcelLoading) setIsImportModalOpen(true);
  };

  const handleImport = (brokerText, cmpText, brokerName, cmpName) => {
    const parsed = parseTrades(brokerText, cmpText);
    if (!parsed.length) throw new Error('No valid trades found in the CSV file.');
    setCsvTrades(parsed);
    setRawTransactions([]);
    setCmpData(TEST_CMP);
    setIsExcelMode(false);
    setBrokerFileName(brokerName);
    setCmpFileName(cmpName);
    setPriceSource('Imported CMP — not a live feed');
    resetSelection();
    setIsImportModalOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#f1f5f9', display: 'flex', flexDirection: 'column' }}>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onImportClick={handleImportClick} />

      {/* Temporary Excel control; permanent import modal comes in a later step. */}
      <div className="container-fluid px-4 pt-3">
        <div className="d-flex flex-wrap align-items-center gap-2">
          <label htmlFor="groww-excel" className="small text-secondary">Import Groww order history</label>
          <input id="groww-excel" type="file" accept=".xlsx" className="form-control form-control-sm w-auto mw-100" onChange={testExcelUpload} disabled={isExcelLoading || isImportModalOpen} />
          {isExcelLoading && <span className="small text-info" role="status">Reading workbook…</span>}
        </div>
      </div>

      {/* One Home component for both data sources. */}
      <Home
        activeTab={activeTab} setActiveTab={setActiveTab}
        tradesCount={isExcelMode ? rawTransactions.length : trades.length}
        brokerFileName={brokerFileName} cmpFileName={cmpFileName}
        onReset={handleReset} summaryMetrics={summaryMetrics}
        filteredTrades={filteredTrades} selectedTrade={selectedTrade}
        setSelectedId={setSelectedId} tableFilter={tableFilter}
        setTableFilter={setTableFilter} priceSource={priceSource}
        keyboardEnabled={!isImportModalOpen && !isExcelLoading}
      />
      <Footer />
      {isImportModalOpen && <ImportModal onClose={() => setIsImportModalOpen(false)} onImport={handleImport} />}
    </div>
  );
}
