import React, { useState } from 'react';

// Shared look: keep these identical across Hero, Dashboard, and Graph
const PAGE_BG = '#0b0f19';
const GLASS_BG = 'rgba(22, 31, 51, 0.7)';

const FEATURE_COLORS = {
  info: {
    border: '#5bc0de',
    glow: 'rgba(91, 192, 222, 0.5)',
    softBg: 'rgba(91, 192, 222, 0.12)',
    text: '#8ae1ff',
    badgeBg: 'rgba(91, 192, 222, 0.12)',
    badgeText: '#bfefff',
  },
  warning: {
    border: '#f4b740',
    glow: 'rgba(244, 183, 64, 0.5)',
    softBg: 'rgba(244, 183, 64, 0.12)',
    text: '#ffd777',
    badgeBg: 'rgba(244, 183, 64, 0.12)',
    badgeText: '#ffdf8f',
  },
  success: {
    border: '#2ec27e',
    glow: 'rgba(46, 194, 126, 0.5)',
    softBg: 'rgba(46, 194, 126, 0.12)',
    text: '#7fe3b0',
    badgeBg: 'rgba(46, 194, 126, 0.12)',
    badgeText: '#b8efd2',
  },
};

const features = [
  {
    icon: 'bi-archive',
    color: 'info',
    title: 'Complete Trade History',
    text: 'Search and access all previously sold stocks in one organized, tax-ready ledger across multiple broker accounts.',
    tag: 'Multi-broker ledger',
  },
  {
    icon: 'bi-graph-up-arrow',
    color: 'warning',
    title: 'Missed Profit Tracker',
    text: 'Quantify exactly how much more you could have made by holding longer or trailing your stop-loss.',
    tag: 'Post-sale upside',
  },
  {
    icon: 'bi-graph-up',
    color: 'success',
    title: 'Post-Sale Price Charts',
    text: 'Overlay your exact buy and sell dates on live price charts to see how the stock moved weeks and months after you exited.',
    tag: 'Live overlay',
  },
];

function FeatureCard({ index, feature }) {
  const [hovered, setHovered] = useState(false);
  const { icon, color, title, text, tag } = feature;
  const palette = FEATURE_COLORS[color] || FEATURE_COLORS.info;

  return (
    <div className="col">
      <div
        className="card h-100 border rounded-4 p-2 transition"
        style={{
          backgroundColor: GLASS_BG,
          borderColor: hovered ? palette.border : 'rgba(255, 255, 255, 0.07)',
          boxShadow: hovered ? `0 0 0 1px ${palette.glow}, 0 18px 40px rgba(15, 23, 42, 0.3)` : 'none',
          transform: hovered ? 'translateY(-4px)' : 'none',
          transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
          backdropFilter: 'blur(12px)',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="card-body p-4 d-flex flex-column">

          <div className="d-flex justify-content-between align-items-start mb-4">
            <span
              className="d-inline-flex align-items-center justify-content-center rounded-3 border"
              style={{
                width: 48,
                height: 48,
                backgroundColor: palette.softBg,
                borderColor: `${palette.border}66`,
                color: palette.text,
              }}
            >
              <i className={`bi ${icon} fs-5`} aria-hidden="true"></i>
            </span>
            <span className="font-monospace small text-secondary">0{index + 1}</span>
          </div>

          <h3 className="h5 fw-bold text-white mb-2">{title}</h3>
          <p className="small text-light opacity-75 lh-lg mb-4">{text}</p>

          <div className="mt-auto">
            <span
              className="badge rounded-pill font-monospace fw-normal px-3 py-2"
              style={{
                backgroundColor: palette.badgeBg,
                color: palette.badgeText,
              }}
            >
              {tag}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="py-5 py-lg-6" style={{ backgroundColor: PAGE_BG }}>
      <div className="container">

        {/* Header */}
        <div className="text-center mx-auto mb-5" style={{ maxWidth: 768 }}>
          {/* <div className="small font-monospace fw-semibold text-success text-uppercase mb-2">
            Designed for Intelligence
          </div> */}
          <h2 className="display-6 fw-extrabold text-white mb-3">
            Everything you need to master your exit discipline, consistently.
          </h2>
          <p className="lead text-secondary mb-0">
            Most traders only analyze entry points. TradeLens gives you an edge by auditing every sell order.
          </p>
        </div>

        {/* Cards */}
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {features.map((f, i) => (
            <FeatureCard key={f.title} index={i} feature={f} />
          ))}
        </div>

      </div>
    </section>
  );
}

export default Features;