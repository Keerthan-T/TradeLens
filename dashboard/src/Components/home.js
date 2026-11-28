import React, { useEffect } from 'react';
import SubNav from './subNav';
import KpiCards from './kpiCards';
import TradeTable from './tradeTable';
import TradeChart from './tradeChart';
import './dashboardLayout.css';

export default function Home({
  activeTab, setActiveTab, tradesCount, brokerFileName, cmpFileName,
  onReset, summaryMetrics, filteredTrades, selectedTrade,
  setSelectedId, tableFilter, setTableFilter, priceSource,
  keyboardEnabled = true
}) {
  useEffect(() => {
    if (!keyboardEnabled) return;
    const handleKeyDown = (event) => {
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.isComposing || event.defaultPrevented) return;
      const target = event.target;
      // Do not intercept typing, menus, or other interactive controls.
      if (target instanceof Element && target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="dialog"], button:not([data-stock-select]), a, [role="slider"]')) return;
      if (!filteredTrades.length) return;
      const current = filteredTrades.findIndex((t) => t.id === selectedTrade?.id);
      const next = current < 0 ? 0 : Math.max(0, Math.min(filteredTrades.length - 1, current + (event.key === 'ArrowDown' ? 1 : -1)));
      event.preventDefault();
      if (next !== current) setSelectedId(filteredTrades[next].id);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyboardEnabled, filteredTrades, selectedTrade?.id, setSelectedId]);

  return (
    <div className="container-fluid p-4">
      <SubNav activeTab={activeTab} setActiveTab={setActiveTab} tradesCount={tradesCount} brokerFileName={brokerFileName} cmpFileName={cmpFileName} onReset={onReset} />
      <div className="mt-4"><KpiCards summaryMetrics={summaryMetrics} /></div>

      <div className="tl-dashboard-grid mt-4">
        <div className="tl-ledger-column">
          <div className="tl-ledger-frame">
            <TradeTable trades={filteredTrades} selectedId={selectedTrade?.id} onSelect={setSelectedId} tableFilter={tableFilter} setTableFilter={setTableFilter} />
          </div>
        </div>
        <div className="tl-chart-column">
          <TradeChart trade={selectedTrade} priceSource={priceSource} />
        </div>
      </div>
    </div>
  );
}
