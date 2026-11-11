import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

// Shared look: use the same values in Hero and Dashboard so the sections match
const PAGE_BG = '#0b0f19';
const GLASS_BG = 'rgba(22, 31, 51, 0.7)';
const PANEL_BG = 'rgba(11, 15, 25, 0.9)';

const chartDataSets = {
  '30D': {
    labels: ['Jan 02', 'Jan 15 (BUY)', 'Jan 28', 'Feb 14 (SELL)', 'Feb 25', 'Mar 10 (CURRENT)'],
    prices: [220, 245, 275, 310, 340, 382],
    buyIndex: 1,
    sellIndex: 3,
    currentIndex: 5,
  },
  '90D': {
    labels: ['Dec 01', 'Dec 20', 'Jan 15 (BUY)', 'Feb 01', 'Feb 14 (SELL)', 'Mar 01', 'Mar 25', 'Apr 10 (CURRENT)'],
    prices: [205, 218, 245, 280, 310, 335, 360, 382],
    buyIndex: 2,
    sellIndex: 4,
    currentIndex: 7,
  },
  '1Y': {
    labels: ['May 23', 'Aug 23', 'Nov 23', 'Jan 15 (BUY)', 'Feb 14 (SELL)', 'May 24 (CURRENT)'],
    prices: [180, 195, 210, 245, 310, 382],
    buyIndex: 3,
    sellIndex: 4,
    currentIndex: 5,
  },
};

const timeframes = [
  { key: '30D', label: '30D Post' },
  { key: '90D', label: '90D Post' },
  { key: '1Y', label: '1 Year' },
];

function PostSaleGraph() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [timeframe, setTimeframe] = useState('90D');

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    const dataConfig = chartDataSets[timeframe];

    const fill = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    fill.addColorStop(0, 'rgba(59, 130, 246, 0.25)');
    fill.addColorStop(1, 'rgba(59, 130, 246, 0)');

    const isMilestone = (idx) =>
      idx === dataConfig.buyIndex || idx === dataConfig.sellIndex || idx === dataConfig.currentIndex;

    const pointColors = dataConfig.prices.map((_, idx) => {
      if (idx === dataConfig.buyIndex) return '#10b981';
      if (idx === dataConfig.sellIndex) return '#ef4444';
      if (idx === dataConfig.currentIndex) return '#3b82f6';
      return 'rgba(255, 255, 255, 0.2)';
    });

    const milestoneBadges = {
      id: 'milestoneBadges',
      afterDraw(chart) {
        const { ctx: c } = chart;
        const meta = chart.getDatasetMeta(0);
        const milestones = [
          { index: dataConfig.buyIndex, text: 'BUY: ₹245', color: '#10b981', bg: '#064e3b' },
          { index: dataConfig.sellIndex, text: 'SELL: ₹310', color: '#f87171', bg: '#7f1d1d' },
          { index: dataConfig.currentIndex, text: 'CURRENT: ₹382', color: '#60a5fa', bg: '#1e3a8a' },
        ];

        milestones.forEach((m) => {
          const point = meta.data[m.index];
          if (!point) return;
          const x = point.x;
          const y = point.y - 18;

          c.save();
          c.font = 'bold 11px JetBrains Mono, monospace';
          const textWidth = c.measureText(m.text).width;
          const padding = 6;

          c.fillStyle = m.bg;
          c.strokeStyle = m.color;
          c.lineWidth = 1;
          c.beginPath();
          c.roundRect(x - textWidth / 2 - padding, y - 12, textWidth + padding * 2, 20, 6);
          c.fill();
          c.stroke();

          c.fillStyle = '#ffffff';
          c.textAlign = 'center';
          c.textBaseline = 'middle';
          c.fillText(m.text, x, y - 2);
          c.restore();
        });
      },
    };

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dataConfig.labels,
        datasets: [
          {
            label: 'HINDCOPPER Price (₹)',
            data: dataConfig.prices,
            borderColor: '#3b82f6',
            borderWidth: 3,
            tension: 0.3,
            fill: true,
            backgroundColor: fill,
            pointBackgroundColor: pointColors,
            pointBorderColor: '#111827',
            pointBorderWidth: 2,
            pointRadius: dataConfig.prices.map((_, i) => (isMilestone(i) ? 8 : 3)),
            pointHoverRadius: dataConfig.prices.map((_, i) => (isMilestone(i) ? 11 : 5)),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#161f33',
            titleColor: '#94a3b8',
            bodyColor: '#ffffff',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            titleFont: { family: 'Inter', size: 12 },
            bodyFont: { family: 'JetBrains Mono', size: 14, weight: 'bold' },
            callbacks: {
              label: (context) => `Price: ₹${context.raw}.00`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.04)' },
            ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } },
          },
          y: {
            min: 150,
            max: 420,
            grid: { color: 'rgba(255, 255, 255, 0.04)' },
            ticks: {
              color: '#94a3b8',
              font: { family: 'JetBrains Mono', size: 11 },
              callback: (value) => '₹' + value,
            },
          },
        },
      },
      plugins: [milestoneBadges],
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [timeframe]);

  return (
    <section
      id="signature-chart"
      className="py-5 border-top border-bottom border-secondary"
      style={{ backgroundColor: PAGE_BG }}
    >
      <div className="container">

        {/* Headline */}
        <div className="text-center mx-auto mb-5" style={{ maxWidth: 768 }}>
          <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis border border-primary border-opacity-50 font-monospace mb-3 px-3 py-2">
            <i className="bi bi-crosshair me-1"></i>
            Signature Decision Review Tool
          </span>
          <h2 className="display-6 fw-bold text-white mb-3">What happened after you sold?</h2>
          <p className="lead text-light opacity-75 mb-0">
            Visualizing stock price trajectory from initial buy to sale date, and tracking the real market price post-exit.
          </p>
        </div>

        {/* Chart card */}
        <div
          className="card border-secondary rounded-4 shadow-lg"
          style={{ backgroundColor: GLASS_BG, backdropFilter: 'blur(12px)' }}
        >
          <div className="card-body p-3 p-sm-4">

            {/* Top bar */}
            <div className="row g-3 align-items-center pb-4 border-bottom border-secondary">
              <div className="col-12 col-lg-4">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3 bg-warning text-dark fw-bold fs-5 flex-shrink-0"
                    style={{ width: 48, height: 48 }}
                  >
                    HC
                  </div>
                  <div>
                    <div className="d-flex align-items-center flex-wrap gap-2">
                      <h3 className="h5 fw-bold text-white mb-0">Hindustan Copper Ltd</h3>
                      <span className="small font-monospace bg-secondary bg-opacity-25 text-light border border-secondary rounded px-2">
                        NSE: HINDCOPPER
                      </span>
                    </div>
                    <p className="small text-secondary mb-0">Position: 20 Shares | Sold on 14 Feb 2024</p>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="col-12 col-lg-5">
                <div
                  className="d-flex flex-wrap align-items-center justify-content-lg-center gap-3 gap-sm-4 border border-secondary rounded-3 px-3 py-2 small fw-medium"
                  style={{ backgroundColor: PANEL_BG }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span className="rounded-circle bg-success border border-4 border-success border-opacity-25" style={{ width: 12, height: 12 }}></span>
                    <span className="text-light">BUY: <strong className="text-success font-monospace">₹245</strong></span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="rounded-circle bg-danger border border-4 border-danger border-opacity-25" style={{ width: 12, height: 12 }}></span>
                    <span className="text-light">SELL: <strong className="text-danger font-monospace">₹310</strong></span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="rounded-circle bg-primary border border-4 border-primary border-opacity-25" style={{ width: 12, height: 12 }}></span>
                    <span className="text-light">CURRENT: <strong className="text-primary font-monospace">₹382</strong></span>
                  </div>
                </div>
              </div>

              {/* Timeframe toggle */}
              <div className="col-12 col-lg-3">
                <div className="btn-group btn-group-sm w-100 font-monospace" role="group" aria-label="Timeframe">
                  {timeframes.map((tf) => (
                    <button
                      key={tf.key}
                      type="button"
                      className={`btn ${timeframe === tf.key ? 'btn-primary fw-semibold' : 'btn-outline-secondary'}`}
                      onClick={() => setTimeframe(tf.key)}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart canvas */}
            <div className="position-relative w-100 mt-4" style={{ height: 'clamp(320px, 50vw, 420px)' }}>
              <canvas ref={canvasRef}></canvas>
            </div>

            {/* Summary strip */}
            <div className="row row-cols-1 row-cols-sm-3 g-3 mt-2 pt-4 border-top border-secondary">
              <div className="col">
                <div className="card h-100 border border-success border-opacity-25" style={{ backgroundColor: GLASS_BG }}>
                  <div className="card-body">
                    <div className="small text-secondary text-uppercase fw-medium">Realized Profit (Banked)</div>
                    <div className="d-flex align-items-baseline gap-2 mt-1">
                      <span className="fs-4 fw-bold font-monospace text-success">+₹1,300</span>
                      <span className="small font-monospace text-success fw-medium">(+26.53%)</span>
                    </div>
                    <p className="small text-secondary mb-0 mt-1">Calculated from Buy ₹245 → Sell ₹310</p>
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="card h-100 border border-warning border-opacity-25" style={{ backgroundColor: GLASS_BG }}>
                  <div className="card-body">
                    <div className="small text-secondary text-uppercase fw-medium">Additional Upside Missed</div>
                    <div className="d-flex align-items-baseline gap-2 mt-1">
                      <span className="fs-4 fw-bold font-monospace text-warning">₹1,440</span>
                      <span className="small font-monospace text-warning fw-medium">(+23.23% post-sale)</span>
                    </div>
                    <p className="small text-secondary mb-0 mt-1">Calculated from Sell ₹310 → Current ₹382</p>
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="card h-100 border border-primary border-opacity-25" style={{ backgroundColor: GLASS_BG }}>
                  <div className="card-body">
                    <div className="small text-secondary text-uppercase fw-medium">Potential Total Return</div>
                    <div className="d-flex align-items-baseline gap-2 mt-1">
                      <span className="fs-4 fw-bold font-monospace text-primary">+55.91%</span>
                      <span className="small font-monospace text-secondary">if held till now</span>
                    </div>
                    <p className="small text-secondary mb-0 mt-1">Total value today: ₹7,640 (bought at ₹4,900)</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default PostSaleGraph;