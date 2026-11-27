import React from 'react';
import { TrendingUp, AlertTriangle, Award, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../utils/formatINR';

const EMPTY_METRICS = {
  totalRealized: 0,
  totalMissed: 0,
  totalTrades: 0,
  wins: 0,
  losses: 0,
  winRate: 0,
  oppRatio: 0,
};

function KpiCard({ label, value, valueClass, accent, icon: Icon, iconClass, badge, badgeClass, note }) {
  return (
    <div className={`card h-100 rounded-4 shadow-lg border-secondary border-start border-4 ${accent}`} style={{ backgroundColor: '#111827' }}>
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <p className="small fw-semibold text-secondary text-uppercase mb-1" style={{ letterSpacing: '0.05em' }}>
              {label}
            </p>
            <h3 className={`h2 fw-bold font-monospace mb-0 mt-1 ${valueClass}`}>{value}</h3>
          </div>
          <span className={`p-2 rounded-3 border ${iconClass}`}>
            <Icon size={20} />
          </span>
        </div>

        <div className="mt-3 d-flex align-items-center gap-2 small">
          <span className={`font-monospace fw-semibold px-2 py-1 rounded ${badgeClass}`}>{badge}</span>
          <span className="text-secondary">{note}</span>
        </div>
      </div>
    </div>
  );
}

export default function KpiCards({ summaryMetrics }) {
  // Fall back to zeros if the prop is missing, so the page doesn't crash
  const m = { ...EMPTY_METRICS, ...(summaryMetrics || {}) };

  const cards = [
    {
      label: 'Total Realized Profit',
      value: formatINR(m.totalRealized),
      valueClass: 'text-success',
      accent: 'border-success',
      icon: TrendingUp,
      iconClass: 'bg-success bg-opacity-10 text-success border-success border-opacity-25',
      badge: `${m.winRate}% Win Rate`,
      badgeClass: 'text-success bg-success bg-opacity-10',
      note: 'Actual banked capital gains',
    },
    {
      label: 'Missed Post-Sale Profit',
      value: formatINR(m.totalMissed),
      valueClass: 'text-warning',
      accent: 'border-warning',
      icon: AlertTriangle,
      iconClass: 'bg-warning bg-opacity-10 text-warning border-warning border-opacity-25',
      badge: 'Unrealized Upside',
      badgeClass: 'text-warning bg-warning bg-opacity-10',
      note: 'Left on table after exiting',
    },
    {
      label: 'Opportunity Loss Ratio',
      value: `${m.oppRatio}%`,
      valueClass: 'text-info',
      accent: 'border-info',
      icon: Award,
      iconClass: 'bg-info bg-opacity-10 text-info border-info border-opacity-25',
      badge: 'Missed / Realized',
      badgeClass: 'text-info bg-info bg-opacity-10',
      note: 'Exit discipline metric',
    },
    {
      label: 'Completed Positions',
      value: m.totalTrades,
      valueClass: 'text-white',
      accent: 'border-primary',
      icon: CheckCircle2,
      iconClass: 'bg-primary bg-opacity-10 text-primary border-primary border-opacity-25',
      badge: `${m.wins} Profitable`,
      badgeClass: 'text-success',
      note: `${m.losses} Cut Losses`,
    },
  ];

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
      {cards.map((c) => (
        <div className="col" key={c.label}>
          <KpiCard {...c} />
        </div>
      ))}
    </div>
  );
}