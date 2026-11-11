import React from 'react';

const PAGE_BG = '#212529';
const GLASS_BG = 'rgba(22, 31, 51, 0.7)';

const steps = [
  {
    title: 'Record Completed Trades',
    text: 'Upload your broker tradebook CSV (Zerodha Console, Groww, Upstox, AngelOne) or quickly log executed sell orders manually.',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.1)',
    border: 'rgba(16, 185, 129, 0.3)',
    shadow: 'rgba(16, 185, 129, 0.1)',
  },
  {
    title: 'Automated Market Sync',
    text: 'TradeLens connects with real-time NSE/BSE feeds to track live prices continuously post-sale.',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.1)',
    border: 'rgba(59, 130, 246, 0.3)',
    shadow: 'rgba(59, 130, 246, 0.1)',
  },
  {
    title: 'Analyze & Improve Exits',
    text: 'Uncover realized profits vs missed upside, score your exit timing, and refine your trading strategy for future trades.',
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.1)',
    border: 'rgba(168, 85, 247, 0.3)',
    shadow: 'rgba(168, 85, 247, 0.1)',
  },
];

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-5 py-sm-6 border-top border-secondary position-relative"
      style={{ backgroundColor: PAGE_BG }}
    >
      <div className="container">

        {/* Header */}
        <div className="text-center mx-auto mb-5" style={{ maxWidth: 768 }}>
          <div className="small font-monospace fw-semibold text-primary text-uppercase mb-2">
            Simple 3-Step Process
          </div>
          <h2 className="display-6 fw-bold text-white mb-3">How TradeLens Works</h2>
          <p className="lead text-secondary mb-0">
            Start auditing your selling decisions in less than two minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="row row-cols-1 row-cols-md-3 g-4 position-relative">

          {/* Connecting line (desktop only) */}
          <div
            className="d-none d-md-block position-absolute top-50 start-0 end-0 mx-auto"
            style={{
              width: '66%',
              height: 2,
              marginTop: -32,
              background:
                'linear-gradient(to right, rgba(16,185,129,0.3), rgba(59,130,246,0.3), rgba(168,85,247,0.3))',
              pointerEvents: 'none',
            }}
          ></div>

          {steps.map((step, i) => (
            <div className="col" key={step.title}>
              <div
                className="h-100 rounded-4 p-4 d-flex flex-column align-items-center text-center border"
                style={{
                  backgroundColor: GLASS_BG,
                  borderColor: 'rgba(255, 255, 255, 0.07)',
                  backdropFilter: 'blur(12px)',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 fw-bold fs-4 mb-4"
                  style={{
                    width: 56,
                    height: 56,
                    color: step.color,
                    backgroundColor: step.bg,
                    border: `1px solid ${step.border}`,
                    boxShadow: `0 10px 15px -3px ${step.shadow}`,
                  }}
                >
                  {i + 1}
                </div>

                <h3 className="fs-5 fw-bold text-white mb-3">{step.title}</h3>
                <p className="small text-light opacity-75 lh-base mb-0">{step.text}</p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default HowItWorks;