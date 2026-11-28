import React, { useEffect, useRef } from 'react';
import { Layers } from 'lucide-react';
import { formatINR } from '../utils/formatINR';

const FILTERS = [
  { key: 'all', label: 'All' }, { key: 'early', label: 'Sold Early' },
  { key: 'optimal', label: 'Optimal' }, { key: 'cutloss', label: 'Cut Loss' }
];
const VERDICT = {
  early: { label: 'Sold Early', className: 'bg-warning bg-opacity-10 text-warning border-warning' },
  cutloss: { label: 'Cut Loss', className: 'bg-danger bg-opacity-10 text-danger border-danger' },
  optimal: { label: 'Optimal', className: 'bg-success bg-opacity-10 text-success border-success' },
  holding: { label: 'Holding', className: 'bg-info bg-opacity-10 text-info border-info' },
  unknown: { label: 'No CMP', className: 'bg-secondary bg-opacity-10 text-light border-secondary' },
  incomplete: { label: 'Incomplete', className: 'bg-danger bg-opacity-10 text-danger border-danger' }
};
const price = (v) => v == null || !Number.isFinite(v) ? 'N/A' : `₹${v.toFixed(2)}`;
const money = (v) => v == null ? 'N/A' : formatINR(v);
const signedMoney = (v) => v == null ? 'N/A' : `${v > 0 ? '+' : ''}${formatINR(v)}`;

export default function TradeTable({ trades = [], selectedId, onSelect = () => {}, tableFilter = 'all', setTableFilter = () => {} }) {
  const scrollRef = useRef(null);
  const selectedRow = useRef(null);
  const headerRef = useRef(null);

  // Scroll only the table, not the entire webpage.
  useEffect(() => {
    const container = scrollRef.current;
    const row = selectedRow.current;
    if (!container || !row) return;
    // If the user is navigating from a row button, move keyboard focus as well.
    if (container.contains(document.activeElement) && document.activeElement?.matches('[data-stock-select]')) {
      row.querySelector('[data-stock-select]')?.focus({ preventScroll: true });
    }
    const bounds = container.getBoundingClientRect();
    const item = row.getBoundingClientRect();
    const top = bounds.top + (headerRef.current?.offsetHeight || 0);
    if (item.top < top) container.scrollTop += item.top - top;
    else if (item.bottom > bounds.bottom) container.scrollTop += item.bottom - bounds.bottom;
  }, [selectedId, trades]);

  return (
    <div className="card h-100 rounded-4 border-secondary shadow-lg overflow-hidden tl-ledger-card" style={{ backgroundColor: '#111827' }}>
      <div className="card-header border-secondary d-flex flex-column flex-xl-row align-items-xl-center justify-content-between gap-3 p-3 p-sm-4" style={{ backgroundColor: '#0d1322' }}>
        <div>
          <h3 className="h6 fw-bold text-white d-flex align-items-center gap-2 mb-1"><Layers size={18} className="text-success" />Broker Orderbook Analytics Ledger</h3>
          <p className="small text-secondary mb-0">Select a stock to audit its trades · ↑ ↓ to switch</p>
        </div>
        <div className="btn-group btn-group-sm" role="group" aria-label="Filter trades">
          {FILTERS.map((f) => <button key={f.key} type="button" aria-pressed={tableFilter === f.key} className={`btn ${tableFilter === f.key ? 'btn-primary fw-semibold' : 'btn-outline-secondary'}`} onClick={() => setTableFilter(f.key)}>{f.label}</button>)}
        </div>
      </div>
      <div className="table-responsive tl-ledger-scroll" ref={scrollRef}>
        <table className="table table-dark table-hover align-middle mb-0 small font-monospace" style={{ whiteSpace: 'nowrap' }}>
          <thead ref={headerRef} className="text-uppercase text-secondary"><tr>
            <th scope="col" className="px-3 py-3">Stock</th>
            <th scope="col" className="px-3 py-3 text-end">Buy / Exit</th>
            <th scope="col" className="px-3 py-3 text-end">CMP Feed</th>
            <th scope="col" className="px-3 py-3 text-end">Realized P&amp;L</th>
            <th scope="col" className="px-3 py-3 text-end">Missed P&amp;L</th>
            <th scope="col" className="px-3 py-3 text-center">Verdict</th>
          </tr></thead>
          <tbody>
            {!trades.length && <tr><td colSpan={6} className="text-center text-secondary py-4">No trades match your filter.</td></tr>}
            {trades.map((t) => {
              const isSelected = t.id === selectedId;
              const verdict = VERDICT[t.category] || VERDICT.unknown;
              const realized = t.realizedPnL;
              return (
                <tr key={t.id} ref={isSelected ? selectedRow : null} onClick={() => onSelect(t.id)} className={isSelected ? 'table-active' : ''} style={{ cursor: 'pointer' }}>
                  <td className="px-3 py-3">
                    <div className="d-flex align-items-center gap-2">
                      <span className="d-inline-flex align-items-center justify-content-center rounded-2 bg-secondary bg-opacity-25 border border-secondary fw-bold text-white flex-shrink-0" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>{t.symbol.substring(0, 2)}</span>
                      <div>
                        <div className="fw-bold text-white font-sans d-flex align-items-center gap-2">
                          <button type="button" data-stock-select aria-pressed={isSelected} className="btn btn-link text-white text-decoration-none p-0 fw-bold tl-stock-select" onClick={(e) => { e.stopPropagation(); onSelect(t.id); }}>{t.symbol}</button>
                          {isSelected && <span className="badge bg-primary-subtle text-primary-emphasis">Active</span>}
                        </div>
                        <div className="text-secondary font-sans" style={{ fontSize: '0.7rem' }}>{t.holdingQty ? `${t.holdingQty} held / ${t.totalSoldQty} sold` : `${t.totalSoldQty} shares sold`}</div>
                        {t.status === 'PARTIALLY SOLD' && <div className="text-warning font-sans" style={{ fontSize: '0.65rem' }}>Partially sold</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-end"><div className="text-light">{price(t.averageBuyPrice)}</div><div className="text-secondary" style={{ fontSize: '0.7rem' }}>→ {price(t.averageSellPrice)}</div></td>
                  <td className="px-3 py-3 text-end fw-bold text-info">{price(t.currentPrice)}</td>
                  <td className={`px-3 py-3 text-end fw-bold ${realized > 0 ? 'text-success' : realized < 0 ? 'text-danger' : 'text-secondary'}`}>{signedMoney(realized)}</td>
                  <td className="px-3 py-3 text-end fw-bold text-warning">{money(t.missedProfit)}</td>
                  <td className="px-3 py-3 text-center"><span className={`badge rounded-pill border px-2 py-1 fw-semibold font-sans ${verdict.className}`}>{verdict.label}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
