import React, { useState, useMemo } from 'react';

import Navbar from './Components/navbar';
import Home from './Components/home';
import Footer from './Components/footer';
import ImportModal from './Components/importModal';
import { fifoMatching } from './utils/fifoMatching';


import './utils/groupTransactions';
import { parseGrowwExcel } from './utils/excelParser';
import { groupTransactions } from './utils/groupTransactions';

import {
  SAMPLE_BROKER_CSV,
  SAMPLE_CMP_CSV
} from './data/sampleData';


// Convert CSV data into trade objects
function parseTrades(brokerText, cmpText) {

  const cmpMap = {};

  cmpText.trim().split('\n').slice(1).forEach((line) => {

    const [symbol, cmp] = line.split(',').map((s) => s.trim());

    if (symbol) {
      cmpMap[symbol.toUpperCase()] = parseFloat(cmp) || 0;
    }

  });

  return brokerText.trim().split('\n').slice(1).map((line, idx) => {

    const [symbol, name, qty, buy, sell] =
      line.split(',').map((s) => s.trim());

    if (!symbol) return null;

    const buyPrice = parseFloat(buy) || 0;
    const sellPrice = parseFloat(sell) || 0;
    const currentPrice = cmpMap[symbol.toUpperCase()];

    // Reject trades with missing or invalid prices
    if (
      buyPrice <= 0 ||
      sellPrice <= 0 ||
      !Number.isFinite(currentPrice) ||
      currentPrice <= 0
    ) {
      throw new Error(`Invalid or missing price data for ${symbol}`);
    }

    const quantity = Number(qty);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error(`Invalid quantity for ${symbol}`);
    }

    let category = 'optimal';

    if (currentPrice > sellPrice * 1.05) {
      category = 'early';
    } else if (sellPrice < buyPrice) {
      category = 'cutloss';
    }

    return {
      id: `TRD-${idx + 101}`,
      symbol: symbol.toUpperCase(),
      name: name || symbol,
      qty: quantity,
      buyPrice,
      sellPrice,
      currentPrice,
      category,
    };

  }).filter(Boolean);
}
const testExcelUpload = async (e) => {

  const file = e.target.files[0];

  if (!file) return;

  try {

    // Step 1: Parse Excel
    const transactions = await parseGrowwExcel(file);

    // Step 2: Group consecutive transactions
    const groups = groupTransactions(transactions);

    // Step 3: FIFO financial calculations
    const stockSummary = fifoMatching(transactions);

    console.log("Total transactions:", transactions.length);

    console.log("Total groups:", groups.length);

    console.log("Total unique stocks:", stockSummary.length);

    // Display stock-wise financial summary
    console.table(
      stockSummary.map((stock) => ({
        Symbol: stock.symbol,

        Bought: stock.totalBoughtQty,
        Sold: stock.totalSoldQty,
        Holding: stock.holdingQty,

        AvgBuy: stock.averageBuyPrice?.toFixed(2),

        AvgSell: stock.averageSellPrice?.toFixed(2),

        AvgHolding: stock.averageHoldingPrice?.toFixed(2),

        SoldBuyAvg: stock.averageSoldBuyPrice?.toFixed(2),

        RealizedPnL: stock.realizedPnL.toFixed(2),

        HoldingCost: stock.holdingCost.toFixed(2),

        UnmatchedSell: stock.unmatchedSellQty,

        Status: stock.status
      }))
    );

    // Detailed Hindustan Copper analysis
    console.log(
      "Hindustan Copper FIFO:",
      stockSummary.find(
        (stock) => stock.symbol === "HINDCOPPER"
      )
    );

  } catch (error) {

    console.error(error.message);

  }
};


export default function App() {

  // Application states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [tableFilter, setTableFilter] = useState('all');
  const [selectedId, setSelectedId] = useState('');

  // Import modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // CSV file names
  const [brokerFileName, setBrokerFileName] =
    useState('Zerodha_Trades_Q1.csv');

  const [cmpFileName, setCmpFileName] =
    useState('NSE_Live_Feed.csv');

  // Initialize sample stock data
  const [trades, setTrades] = useState(() =>
    parseTrades(SAMPLE_BROKER_CSV, SAMPLE_CMP_CSV)
  );


  // Calculate portfolio-wide KPI metrics
  const summaryMetrics = useMemo(() => {

    let totalRealized = 0;
    let totalMissed = 0;
    let wins = 0;
    let losses = 0;

    trades.forEach((t) => {

      const pnl = (t.sellPrice - t.buyPrice) * t.qty;

      totalRealized += pnl;

      if (pnl >= 0) {
        wins++;
      } else {
        losses++;
      }

      if (t.currentPrice > t.sellPrice) {
        totalMissed +=
          (t.currentPrice - t.sellPrice) * t.qty;
      }

    });

    const totalTrades = trades.length;

    return {
      totalRealized,
      totalMissed,
      totalTrades,
      wins,
      losses,

      winRate: totalTrades
        ? Math.round((wins / totalTrades) * 100)
        : 0,

      oppRatio: totalRealized !== 0
        ? Math.round(
            (totalMissed / Math.abs(totalRealized)) * 100
          )
        : 0,
    };

  }, [trades]);


  // Search and filter trades
  const filteredTrades = useMemo(() => {

    const q = searchQuery.toLowerCase();

    return trades.filter((t) => {

      const matchesSearch =
        t.symbol.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q);

      const matchesFilter =
        tableFilter === 'all' ||
        t.category === tableFilter;

      return matchesSearch && matchesFilter;

    });

  }, [trades, searchQuery, tableFilter]);


  // Selected stock for chart
  const selectedTrade =
    trades.find((t) => t.id === selectedId) || trades[0];


  // Reset dashboard to sample data
  const handleReset = () => {

    setTrades(
      parseTrades(SAMPLE_BROKER_CSV, SAMPLE_CMP_CSV)
    );

    setBrokerFileName('Zerodha_Trades_Q1.csv');
    setCmpFileName('NSE_Live_Feed.csv');

    setSelectedId('');
    setSearchQuery('');
    setTableFilter('all');
    setActiveTab('overview');

  };


  // Open CSV import modal
  const handleImportClick = () => {
    setIsImportModalOpen(true);
  };


  // Receive and process uploaded CSV files
  const handleImport = (
    brokerText,
    cmpText,
    brokerName,
    cmpName
  ) => {

    const parsedTrades = parseTrades(brokerText, cmpText);

    if (parsedTrades.length === 0) {
      throw new Error('No valid trades found in the CSV file.');
    }

    // Update dashboard data
    setTrades(parsedTrades);

    // Update displayed file names
    setBrokerFileName(brokerName);
    setCmpFileName(cmpName);

    // Select first imported stock
    setSelectedId(parsedTrades[0].id);

    // Reset search and filters
    setSearchQuery('');
    setTableFilter('all');
    setActiveTab('overview');

    // Close import modal
    setIsImportModalOpen(false);

  };


  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0b0f19',
        color: '#f1f5f9',
        display: 'flex',
        flexDirection: 'column'
      }}
    >

      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onImportClick={handleImportClick}
      />
      <div className="p-3">

  <input
    type="file"
    accept=".xlsx"
    className="form-control"
    onChange={testExcelUpload}
  />

</div>

      <Home
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tradesCount={trades.length}
        brokerFileName={brokerFileName}
        cmpFileName={cmpFileName}
        onReset={handleReset}
        summaryMetrics={summaryMetrics}
        filteredTrades={filteredTrades}
        selectedTrade={selectedTrade}
        setSelectedId={setSelectedId}
        tableFilter={tableFilter}
        setTableFilter={setTableFilter}
      />

      <Footer />

      {/* CSV Import Modal */}
      {isImportModalOpen && (
        <ImportModal
          onClose={() => setIsImportModalOpen(false)}
          onImport={handleImport}
        />
      )}

    </div>
  );
}