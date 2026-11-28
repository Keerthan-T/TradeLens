import React, { useState } from 'react';
import { BrainCircuit } from 'lucide-react';
import { formatINR } from '../utils/formatINR';
import PriceChart from './priceChart';

const PANEL_BG = '#111827';
const INNER_BG = '#0b0f19';
const fmtPrice = (v) => v == null || !Number.isFinite(v) ? 'N/A' : `₹${v.toFixed(2)}`;
const fmtMoney = (v) => v == null ? 'N/A' : formatINR(v);
const fmtPct = (v) => v == null ? 'N/A' : `${v.toFixed(2)}%`;
const pnlClass = (v) => v == null || v === 0 ? 'text-secondary' : v > 0 ? 'text-success' : 'text-danger';

function Metric({ label, value, color }) {
  return <div className="col-6"><div className="rounded-2 border border-secondary p-2 h-100" style={{ backgroundColor: INNER_BG }}>
    <div className="text-secondary" style={{ fontSize: '0.625rem' }}>{label}</div>
    <div className={`fw-bold ${color}`}>{value}</div>
  </div></div>;
}

// Both charts share the same vertical space. Hovering one expands it
// and shrinks its sibling, so the surrounding dashboard stays stable.
function ChartPair({ trade, priceSource }) {
  const [activeChart, setActiveChart] = useState(null);
  const getSize = (name) => activeChart == null ? 'normal' : activeChart === name ? 'expanded' : 'compact';
  const activate = (name) => setActiveChart(name);
  const clear = () => setActiveChart(null);

  return (
    <div className="tl-chart-pair" onPointerLeave={(event) => {
      if (event.pointerType !== 'touch') clear();
    }} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) clear();
    }}>
      <div className="tl-chart-slot" onPointerEnter={(event) => {
        if (event.pointerType !== 'touch') activate('average');
      }}>
        <PriceChart title="Overall Weighted Average"
          subtitle="Historical buy / exit averages and latest available CMP"
          points={trade.averageGraph} priceSource={priceSource}
          size={getSize('average')} onActivate={() => activate('average')} />
      </div>
      <div className="tl-chart-slot" onPointerEnter={(event) => {
        if (event.pointerType !== 'touch') activate('history');
      }}>
        <PriceChart title="Grouped Transaction History"
          subtitle="Recorded executions in order, not a continuous price chart"
          points={trade.transactionGraph} priceSource={priceSource}
          size={getSize('history')} onActivate={() => activate('history')} />
      </div>
      <div className="d-flex align-items-center justify-content-between gap-2 small text-secondary">
        <span>Hover to enlarge · Tap or use ← / → to inspect</span>
        <button type="button" className="btn btn-sm btn-outline-secondary py-0" onClick={clear}>Equal size</button>
      </div>
    </div>
  );
}

export default function TradeChart({ trade, priceSource }) {
  if (!trade) return <div className="card h-100 rounded-4 border-secondary shadow-lg" style={{ backgroundColor: PANEL_BG }}><div className="card-body p-4 text-secondary">No matching stock. Clear the search or change the filter.</div></div>;
  const hasSales = trade.matchedSoldQty > 0;
  const complete = trade.status !== 'INCOMPLETE';
  // Comparable sold-share cost basis, not the historical average of all purchases.
  const potentialProfit = trade.currentPrice == null || !hasSales ? null : trade.currentPrice * trade.matchedSoldQty - trade.soldCost;
  const efficiency = complete && potentialProfit != null && potentialProfit > 0 ? Math.round(Math.max(0, Math.min(100, trade.realizedPnL / potentialProfit * 100))) : null;
  let assessment;
  if (!complete) assessment = 'Transaction history is incomplete. Displayed P&L covers matched orders only.';
  else if (!hasSales) assessment = 'No shares sold yet. Evaluate the current holding and its acquisition cost; exit metrics are not applicable.';
  else if (trade.currentPrice == null) assessment = 'CMP is unavailable. Realized P&L is calculated from recorded trades; post-sale metrics are unavailable.';
  else if (trade.missedProfit > 0 && trade.lossAvoided > 0) assessment = 'Some sales were below the current snapshot and others above it. Both missed upside and avoided declines are shown.';
  else if (trade.missedProfit > 0) assessment = 'The current price is above one or more recorded selling prices. Missed upside compares those sales against CMP.';
  else if (trade.lossAvoided > 0) assessment = 'The current price is below one or more recorded selling prices. The difference represents a hypothetical avoided decline.';
  else assessment = 'The current price is unchanged relative to recorded selling prices.';
  return (
    <div className="card h-100 rounded-4 border-secondary shadow-lg" style={{ backgroundColor: PANEL_BG }}>
      <div className="card-body p-3 p-xl-4 d-flex flex-column gap-3">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 pb-3 border-bottom border-secondary">
          <div className="d-flex align-items-center gap-3" style={{ minWidth: 0 }}>
            <span className="d-inline-flex align-items-center justify-content-center rounded-3 border border-warning bg-warning bg-opacity-10 text-warning fw-bold font-monospace flex-shrink-0" style={{ width: 40, height: 40, fontSize: '0.875rem' }}>{trade.symbol.substring(0, 2)}</span>
            <div style={{ minWidth: 0 }}>
              <h3 className="h6 fw-bold text-white mb-0">{trade.name}</h3>
              <p className="small text-secondary font-monospace mb-0">Buy: {fmtPrice(trade.averageBuyPrice)} | Exit: {fmtPrice(trade.averageSellPrice)} | CMP: {fmtPrice(trade.currentPrice)}</p>
              <p className="small text-secondary mb-0">{trade.totalBoughtQty} bought · {trade.totalSoldQty} sold · {trade.holdingQty} held</p>
            </div>
          </div>
          <div className="d-flex flex-column align-items-end gap-1">
            <span className="small font-monospace bg-secondary bg-opacity-25 text-light border border-secondary rounded px-2 py-1">{trade.symbol}</span>
            <span className="small text-info">{trade.status}</span>
          </div>
        </div>
        <div className="small text-warning">{priceSource}</div>
        <ChartPair key={trade.id} trade={trade} priceSource={priceSource} />
        <div className="rounded-3 border border-secondary p-3 font-monospace small" style={{ backgroundColor: '#161f33' }}>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <span className="text-secondary d-flex align-items-center gap-2 fw-medium"><BrainCircuit size={16} color="#a78bfa" />{hasSales ? 'Selling Decision Assessment' : 'Holding Performance Assessment'}</span>
            <span className="fw-bold text-info">{efficiency == null ? 'Efficiency: N/A' : `${efficiency}% Efficiency`}</span>
          </div>
          <div className="row g-2 text-center mb-3">
            <Metric label="REALIZED PROFIT" value={fmtMoney(trade.realizedPnL)} color={pnlClass(trade.realizedPnL)} />
            <Metric label="MISSED UPSIDE" value={fmtMoney(trade.missedProfit)} color="text-warning" />
            <Metric label="UNREALIZED P&L" value={fmtMoney(trade.unrealizedPnL)} color={pnlClass(trade.unrealizedPnL)} />
            <Metric label="LOSS AVOIDED" value={fmtMoney(trade.lossAvoided)} color="text-success" />
            <Metric label="HOLDING AVG PRICE" value={fmtPrice(trade.averageHoldingPrice)} color="text-light" />
            <Metric label="HOLDING VALUE" value={fmtMoney(trade.holdingValue)} color="text-info" />
            <Metric label="REALIZED RETURN" value={fmtPct(trade.realizedReturn)} color={pnlClass(trade.realizedReturn)} />
            <Metric label="UNREALIZED RETURN" value={fmtPct(trade.unrealizedReturn)} color={pnlClass(trade.unrealizedReturn)} />
          </div>
          <p className="text-light small lh-base mb-0 pt-2 border-top border-secondary">{assessment}</p>
          <p className="text-secondary small mb-0 mt-2">Total P&amp;L: <span className={pnlClass(trade.totalPnL)}>{fmtMoney(trade.totalPnL)}</span> · Gross, before charges. Exit verdicts are CMP-based heuristics.</p>
        </div>
      </div>
    </div>
  );
}
