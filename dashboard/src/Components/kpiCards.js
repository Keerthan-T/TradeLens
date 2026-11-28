import React from 'react';
import { TrendingUp, AlertTriangle, Award, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../utils/formatINR';

function KpiCard({ label, value, valueClass, accent, icon: Icon, iconClass, badge, badgeClass, note }) {
  return (
    <div className={`card h-100 rounded-4 shadow-lg border-secondary border-start border-4 ${accent}`} style={{ backgroundColor: '#111827' }}>
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <div><p className="small fw-semibold text-secondary text-uppercase mb-1" style={{ letterSpacing: '0.05em' }}>{label}</p><h3 className={`h2 fw-bold font-monospace mb-0 mt-1 ${valueClass}`}>{value}</h3></div>
          <span className={`p-2 rounded-3 border ${iconClass}`}><Icon size={20} /></span>
        </div>
        <div className="mt-3 d-flex align-items-center flex-wrap gap-2 small"><span className={`font-monospace fw-semibold px-2 py-1 rounded ${badgeClass}`}>{badge}</span><span className="text-secondary">{note}</span></div>
      </div>
    </div>
  );
}

export default function KpiCards({ summaryMetrics }) {
  const m = summaryMetrics || { totalRealized: 0, totalMissed: 0, totalTrades: 0, wins: 0, losses: 0, breakEven: 0, winRate: null, oppRatio: null, fullCoverage: true, pricedSalesCount: 0, soldCount: 0, incompleteCount: 0 };
  const money = (v) => v == null ? 'N/A' : formatINR(v);
  const cards = [
    { label: 'Total Realized Profit', value: money(m.totalRealized), valueClass: m.totalRealized < 0 ? 'text-danger' : 'text-success', accent: 'border-success', icon: TrendingUp, iconClass: 'bg-success bg-opacity-10 text-success border-success border-opacity-25', badge: m.winRate == null ? 'Win Rate: N/A' : `${m.winRate}% Win Rate`, badgeClass: 'text-success bg-success bg-opacity-10', note: m.incompleteCount ? 'Matched sales only' : 'Gross gains and losses' },
    { label: 'Missed Post-Sale Profit', value: money(m.totalMissed), valueClass: 'text-warning', accent: 'border-warning', icon: AlertTriangle, iconClass: 'bg-warning bg-opacity-10 text-warning border-warning border-opacity-25', badge: m.fullCoverage ? 'Unrealized Upside' : 'Partial coverage', badgeClass: 'text-warning bg-warning bg-opacity-10', note: m.fullCoverage ? 'Compared with CMP' : `${m.pricedSalesCount}/${m.soldCount} sold positions priced` },
    { label: 'Opportunity Loss Ratio', value: m.oppRatio == null ? 'N/A' : `${m.oppRatio}%`, valueClass: 'text-info', accent: 'border-info', icon: Award, iconClass: 'bg-info bg-opacity-10 text-info border-info border-opacity-25', badge: 'Missed / Realized', badgeClass: 'text-info bg-info bg-opacity-10', note: m.fullCoverage ? 'Exit discipline metric' : 'Incomplete CMP coverage' },
    { label: 'Completed Positions', value: m.totalTrades, valueClass: 'text-white', accent: 'border-primary', icon: CheckCircle2, iconClass: 'bg-primary bg-opacity-10 text-primary border-primary border-opacity-25', badge: `${m.wins} Profitable`, badgeClass: 'text-success', note: `${m.losses} Cut Losses${m.breakEven ? ` · ${m.breakEven} Flat` : ''}` }
  ];
  return <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">{cards.map((card) => <div className="col" key={card.label}><KpiCard {...card} /></div>)}</div>;
}
