import React from 'react';
import { Layers } from 'lucide-react';
import { formatINR } from '../utils/formatINR';

const PANEL_BG = '#111827';
const TOOLBAR_BG = '#0d1322';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'early', label: 'Sold Early' },
  { key: 'optimal', label: 'Optimal' },
  { key: 'cutloss', label: 'Cut Loss' },
];

const VERDICT = {
  early: { label: 'Sold Early', className: 'bg-warning bg-opacity-10 text-warning border-warning' },
  cutloss: { label: 'Cut Loss', className: 'bg-danger bg-opacity-10 text-danger border-danger' },
  optimal: { label: 'Optimal', className: 'bg-success bg-opacity-10 text-success border-success' },
};


export default function TradeTable({
  trades = [],
  selectedId,
  onSelect = () => {},
  tableFilter = 'all',
  setTableFilter = () => {},
}) {
 
  return (
    <div
      className="card h-100 rounded-4 border-secondary shadow-lg overflow-hidden"
      style={{ backgroundColor: PANEL_BG }}
    >
      {/* Toolbar */}
      <div
        className="card-header border-secondary d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 p-3 p-sm-4"
        style={{ backgroundColor: TOOLBAR_BG }}
      >
        <div>
          <h3 className="h6 fw-bold text-white d-flex align-items-center gap-2 mb-1">
            <Layers size={18} className="text-success" />
            Broker Orderbook Analytics Ledger
          </h3>
          <p className="small text-secondary mb-0">
            Select a stock row to audit post-exit price trajectory
          </p>
        </div>

        <div className="btn-group btn-group-sm" role="group" aria-label="Filter trades">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`btn ${tableFilter === f.key ? 'btn-primary fw-semibold' : 'btn-outline-secondary'}`}
              onClick={() => setTableFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-dark table-hover align-middle mb-0 small font-monospace">
          <thead className="text-uppercase text-secondary">
            <tr>
              <th scope="col" className="px-3 py-3">Stock</th>
              <th scope="col" className="px-3 py-3 text-end">Buy / Exit</th>
              <th scope="col" className="px-3 py-3 text-end">CMP Feed</th>
              <th scope="col" className="px-3 py-3 text-end">Realized P&amp;L</th>
              <th scope="col" className="px-3 py-3 text-end">Missed P&amp;L</th>
              <th scope="col" className="px-3 py-3 text-center">Verdict</th>
            </tr>
          </thead>

          <tbody>
            {trades.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-secondary py-4">
                  No trades match your filter.
                </td>
              </tr>
            )}
            

            {trades.map((t) => {
              const isSelected = t.id === selectedId;
              const realized = (t.sellPrice - t.buyPrice) * t.qty;
              const missed = Math.max(0, (t.currentPrice - t.sellPrice) * t.qty);
              const verdict = VERDICT[t.category] || VERDICT.optimal;
              
              return (
                <tr
                  key={t.id}
                  onClick={() => onSelect(t.id)}
                  className={isSelected ? 'table-active' : ''}
                  style={{ cursor: 'pointer' }}
                >
                  <td className="px-3 py-3">
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className="d-inline-flex align-items-center justify-content-center rounded-2 bg-secondary bg-opacity-25 border border-secondary fw-bold text-white"
                        style={{ width: 32, height: 32, fontSize: '0.75rem' }}
                      >
                        {t.symbol.substring(0, 2)}
                      </span>
                      <div>
                        <div className="fw-bold text-white font-sans d-flex align-items-center gap-2">
                          {t.symbol}
                          {isSelected && (
                            <span className="badge bg-primary-subtle text-primary-emphasis">Active</span>
                          )}
                        </div>
                        <div className="text-secondary font-sans" style={{ fontSize: '0.7rem' }}>
                          {t.qty} shares
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3 text-end">
                    <div className="text-light">₹{t.buyPrice}</div>
                    <div className="text-secondary" style={{ fontSize: '0.7rem' }}>
                      → ₹{t.sellPrice}
                    </div>
                  </td>

                  <td className="px-3 py-3 text-end fw-bold text-info">₹{t.currentPrice.toFixed(2)}</td>

                  <td className={`px-3 py-3 text-end fw-bold ${realized >= 0 ? 'text-success' : 'text-danger'}`}>
                    {realized >= 0 ? '+' : ''}
                    {formatINR(realized)}
                  </td>

                  <td className="px-3 py-3 text-end fw-bold text-warning">
                    {missed > 0 ? formatINR(missed) : '₹0'}
                  </td>

                  <td className="px-3 py-3 text-center">
                    <span
                      className={`badge rounded-pill border px-2 py-1 fw-semibold font-sans ${verdict.className}`}
                    >
                      {verdict.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}