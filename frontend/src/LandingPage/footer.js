import React from 'react';

const APP_NAME = 'TradeLens';
const PAGE_BG = '#070a11';
const DEVELOPER = 'Keerthan T';

// Replace the # placeholders with your real profile URLs
const socials = [
  { label: 'GitHub', icon: 'bi-github', href: 'https://github.com/your-username' },
  { label: 'LinkedIn', icon: 'bi-linkedin', href: 'https://linkedin.com/in/your-username' },
  { label: 'Email', icon: 'bi-envelope-fill', href: 'mailto:you@example.com' },
  { label: 'Portfolio', icon: 'bi-globe', href: 'https://your-portfolio.example.com' },
];

const links = [
  { label: 'Overview', href: '#overview' },
  { label: 'Dashboard Demo', href: '#dashboard-preview' },
  { label: 'HINDCOPPER Graph', href: '#signature-chart' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
];

function Footer() {
  return (
    <footer className="border-top border-secondary py-5 small text-secondary" style={{ backgroundColor: PAGE_BG }}>
      <div className="container">

        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-4 border-bottom border-secondary pb-4">

          {/* Brand */}
          <div className="d-flex align-items-center gap-3">
            <span
              className="d-flex align-items-center justify-content-center rounded-3 text-success border border-success border-opacity-50 bg-success bg-opacity-10"
              style={{ width: 32, height: 32 }}
            >
              <i className="bi bi-upc-scan"></i>
            </span>
            <span className="fs-5 fw-bold text-white">
              {APP_NAME.slice(0, -4)}
              <span className="text-success">{APP_NAME.slice(-4)}</span>
            </span>
          </div>

          {/* Links */}
          <nav className="d-flex flex-wrap justify-content-center gap-4 small">
            {links.map((link) => (
              <a key={link.label} href={link.href} className="link-secondary text-decoration-none">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <div className="font-monospace small text-secondary text-md-end">
            © 2026 {APP_NAME} . All rights reserved.
          </div>

        </div>

        {/* Developer credit and social links */}
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 py-4 border-bottom border-secondary">
          <div className="d-flex align-items-center gap-2">
            <span className="text-secondary">Designed & developed by</span>
            <span className="fw-bold text-white">{DEVELOPER}</span>
          </div>

          <div className="d-flex flex-wrap justify-content-center gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-2 px-3"
              >
                <i className={`bi ${s.icon}`}></i>
                <span>{s.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-4 mb-0 text-center mx-auto lh-base" style={{ maxWidth: 768, fontSize: '0.6875rem' }}>
          Disclaimer: {APP_NAME} is strictly a post-trade decision analytics and historical tracking platform. {APP_NAME} is not a registered broker-dealer or investment advisor and does not facilitate stock buying or selling execution. All market data displayed is for analytical review purposes.
        </p>

      </div>
    </footer>
  );
}

export default Footer;