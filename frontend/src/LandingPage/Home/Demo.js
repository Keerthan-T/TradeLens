import React, { useState } from 'react';

const metrics = [
  { label: 'Total Realized Profit', value: '₹42,800', sub: '+14.8%', subText: 'Banked cash returns', color: 'success', icon: 'bi-graph-up-arrow' },
  { label: 'Missed Profit (Left on Table)', value: '₹17,400', sub: '+28.9%', subText: 'Post-sale rally upside', color: 'warning', icon: 'bi-exclamation-triangle' },
  { label: 'Completed Trades', value: '38', sub: '29 Profitable', subText: '9 Losses', color: 'primary', icon: 'bi-check2-all' },
  { label: 'Avg Return / Trade', value: '+14.8%', sub: 'Avg Hold:', subText: '42 Days', color: 'info', icon: 'bi-pie-chart' },
];

const rows = [
  {
    sym: 'HINDCOPPER', name: 'Hindustan Copper Ltd', qty: 20, initials: 'HC', avatar: 'warning', focus: true,
    buy: '₹245.00', sell: '₹310.00', cmp: '₹382.00',
    realized: '+₹1,300', realizedPct: '+26.5%', missed: '₹1,440', missedPct: '+23.2% post-sale',
    verdict: 'Sold Too Early', verdictColor: 'warning', icon: 'bi-clock', tag: 'early',
  },
  {
    sym: 'RENTOMOJO', name: 'Edelweiss / Rentomojo', qty: 20, initials: 'RM', avatar: 'success',
    buy: '₹600.00', sell: '₹720.00', cmp: '₹805.00',
    realized: '+₹2,400', realizedPct: '+20.0%', missed: '₹1,700', missedPct: '+11.8% post-sale',
    verdict: 'Left Upside', verdictColor: 'warning', icon: 'bi-arrow-up-right', tag: 'early',
  },
  {
    sym: 'TATASTEEL', name: 'Tata Steel Ltd', qty: 150, initials: 'TS', avatar: 'primary',
    buy: '₹118.00', sell: '₹156.00', cmp: '₹142.50',
    realized: '+₹5,700', realizedPct: '+32.2%', missed: '₹0', missedPct: 'Saved ₹2,025 drop',
    verdict: 'Great Exit Peak', verdictColor: 'success', icon: 'bi-award', tag: 'optimal',
  },
  {
    sym: 'ZOMATO', name: 'Eternal Ltd / Zomato', qty: 100, initials: 'ZM', avatar: 'danger',
    buy: '₹180.00', sell: '₹225.00', cmp: '₹270.00',
    realized: '+₹4,500', realizedPct: '+25.0%', missed: '₹4,500', missedPct: '+20.0% post-sale',
    verdict: 'Rallied After Exit', verdictColor: 'warning', icon: 'bi-graph-up', tag: 'early',
  },
];

function Dashboard() {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const visibleRows = rows
    .filter((r) => filter === 'all' || r.tag === filter)
    .filter((r) => r.sym.toLowerCase().includes(query.toLowerCase()));

  return (
    <section id="dashboard-preview" className="py-5 position-relative bg-dark text-white">
      <div className="container">

        {/* Section header */}
        <div className="d-flex flex-column flex-sm-row align-items-sm-end justify-content-between gap-3 border-bottom border-secondary pb-4 mb-4">
          <div>
            <div className="small font-monospace fw-semibold text-info text-uppercase mb-1">Live Application Workspace</div>
            <h2 className="h2 fw-bold mb-0">Trade Performance Dashboard</h2>
          </div>
          {/* <div className="d-flex align-items-center gap-2">
            <span className="small font-monospace d-flex align-items-center gap-2 bg-black border border-secondary rounded-2 px-3 py-2 text-secondary">
              <span className="spinner-grow spinner-grow-sm text-success" role="status" aria-hidden="true"></span>
              NSE Market: Open
            </span>
            <button type="button" className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1">
              <i className="bi bi-arrow-clockwise"></i> Refresh
            </button>
          </div> */}
        </div>

        {/* Dashboard window */}
        <div className="card bg-dark border-secondary rounded-4 shadow-lg overflow-hidden">

          {/* Window bar */}
          <div className="card-header bg-black bg-opacity-50 border-secondary d-flex flex-wrap align-items-center justify-content-between gap-3 px-3 py-2">
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex gap-1">
                <span className="rounded-circle bg-danger" style={{ width: 12, height: 12 }}></span>
                <span className="rounded-circle bg-warning" style={{ width: 12, height: 12 }}></span>
                <span className="rounded-circle bg-success" style={{ width: 12, height: 12 }}></span>
              </div>
              <div className="vr text-secondary"></div>
              <span className="small font-monospace text-secondary d-flex align-items-center gap-2">
                <i className="bi bi-person text-info"></i> Investor Portfolio: FY 2024-25
              </span>
            </div>

            <div className="btn-group btn-group-sm" role="group" aria-label="Filter stocks">
              {[
                { key: 'all', label: 'All Stocks' },
                { key: 'early', label: 'Early Exits' },
                { key: 'optimal', label: 'Optimal Exits' },
              ].map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={`btn ${filter === f.key ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card-body p-3 p-sm-4">

            {/* Metric cards */}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 mb-4">
              {metrics.map((m) => (
                <div className="col" key={m.label}>
                  <div className={`card bg-dark border-secondary border-start border-4 border-${m.color} h-100`}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p className="small text-secondary text-uppercase fw-medium mb-1">{m.label}</p>
                          <h3 className={`h3 fw-bolder font-monospace text-${m.color} mb-0`}>{m.value}</h3>
                        </div>
                        <span className={`p-2 rounded-3 bg-${m.color} bg-opacity-10 text-${m.color} border border-${m.color} border-opacity-25`}>
                          <i className={`bi ${m.icon}`}></i>
                        </span>
                      </div>
                      <div className="mt-3 d-flex align-items-center gap-2 small">
                        <span className={`font-monospace fw-semibold text-${m.color}`}>{m.sub}</span>
                        <span className="text-secondary">{m.subText}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table card */}
            <div className="card bg-dark border-secondary">
              <div className="card-header bg-black bg-opacity-25 border-secondary d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 py-3">
                <div>
                  <h3 className="h5 fw-bold mb-0 d-flex align-items-center gap-2">
                    <i className="bi bi-clock-history text-success"></i>
                    Recently Sold Stocks & Post-Sale Status
                  </h3>
                  <p className="small text-secondary mb-0">Comparing your realized exit price with live current market price (CMP)</p>
                </div>
                <div className="input-group input-group-sm" style={{ minWidth: 220 }}>
                  <span className="input-group-text bg-black border-secondary text-secondary">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control bg-black border-secondary text-light font-monospace"
                    placeholder="Search stock symbol..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0 small font-monospace">
                  <thead className="text-uppercase text-secondary">
                    <tr>
                      <th scope="col" className="px-3 py-3">Stock &amp; Qty</th>
                      <th scope="col" className="px-3 py-3 text-end">Buy Avg</th>
                      <th scope="col" className="px-3 py-3 text-end">Sell Avg</th>
                      <th scope="col" className="px-3 py-3 text-end">Current Price</th>
                      <th scope="col" className="px-3 py-3 text-end">Realized Profit</th>
                      <th scope="col" className="px-3 py-3 text-end">Missed Profit</th>
                      <th scope="col" className="px-3 py-3 text-center">Decision Verdict</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRows.map((r) => (
                      <tr key={r.sym} className={r.focus ? 'table-active' : ''}>
                        <td className="px-3 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <span className={`d-flex align-items-center justify-content-center rounded-2 border border-${r.avatar} border-opacity-25 bg-${r.avatar} bg-opacity-10 text-${r.avatar} fw-bold`}
                                  style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
                              {r.initials}
                            </span>
                            <div>
                              <div className="fw-bold text-white font-sans d-flex align-items-center gap-2">
                                {r.sym}
                                {r.focus && <span className="badge bg-info-subtle text-info-emphasis">Active Focus</span>}
                              </div>
                              <div className="text-secondary" style={{ fontSize: '0.7rem' }}>
                                {r.name} • {r.qty} Shares
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-end text-light">{r.buy}</td>
                        <td className="px-3 py-3 text-end text-light fw-medium">{r.sell}</td>
                        <td className="px-3 py-3 text-end fw-bold text-info">{r.cmp}</td>
                        <td className="px-3 py-3 text-end fw-bold text-success">
                          {r.realized}
                          <div className="text-success opacity-75 fw-normal" style={{ fontSize: '0.65rem' }}>{r.realizedPct}</div>
                        </td>
                        <td className="px-3 py-3 text-end fw-bold text-warning">
                          {r.missed}
                          <div className="text-warning opacity-75 fw-normal" style={{ fontSize: '0.65rem' }}>{r.missedPct}</div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`badge rounded-pill bg-${r.verdictColor}-subtle text-${r.verdictColor}-emphasis border border-${r.verdictColor} border-opacity-50 d-inline-flex align-items-center gap-1 px-3 py-2`}>
                            <i className={`bi ${r.icon}`}></i>
                            {r.verdict}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {visibleRows.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center text-secondary py-4">No stocks match your filter.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;