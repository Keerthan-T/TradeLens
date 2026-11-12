import React, { useState } from 'react';

const APP_NAME = 'TradeLens';
const PAGE_BG = '#0b0f19';

const links = [
  { label: 'Overview', href: '#overview' },
  { label: 'Live Demo', href: '#dashboard-preview', live: true },
  { label: 'Post-Sale Graph', href: '#signature-chart' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className="sticky-top border-bottom border-secondary"
      style={{
        backgroundColor: 'rgba(11, 15, 25, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <nav className="container d-flex align-items-center justify-content-between py-3" style={{ minHeight: 64 }}>

        {/* Logo */}
        <a href="#overview" className="d-flex align-items-center gap-3 text-decoration-none">
          <span
            className="d-flex align-items-center justify-content-center rounded-3 text-success"
            style={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, #3b82f6, #10b981, #34d399)',
              padding: 1.5,
            }}
          >
            <span
              className="d-flex align-items-center justify-content-center w-100 h-100 rounded-3"
              style={{ backgroundColor: PAGE_BG }}
            >
              <i className="bi bi-upc-scan text-success fs-5"></i>
            </span>
          </span>
          <span className="d-flex flex-column">
            <span className="fs-4 fw-bold text-white lh-1">
              {APP_NAME.slice(0, -4)}
              <span className="text-success">{APP_NAME.slice(-4)}</span>
            </span>
            <span className="font-monospace text-secondary text-uppercase" style={{ fontSize: '0.625rem', letterSpacing: '0.1em' }}>
              Post-Trade Analytics
            </span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="d-none d-md-flex align-items-center gap-4 small fw-medium text-light">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="nav-link p-0 text-light d-flex align-items-center gap-2">
              {link.live && <span className="spinner-grow spinner-grow-sm text-success" role="status" aria-hidden="true" style={{ width: 8, height: 8 }}></span>}
              {link.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="d-flex align-items-center gap-2 gap-sm-3">
          <a href="#dashboard-preview" className="d-none d-sm-inline-block btn btn-link text-light text-decoration-none fw-medium small px-3">
            Sign In
          </a>
          <a
            href="#dashboard-preview"
            className="btn btn-sm btn-success fw-semibold px-3 py-2 d-flex align-items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.35)',
            }}
          >
            <span>Get Started</span>
            <i className="bi bi-arrow-right"></i>
          </a>

          {/* Mobile toggle */}
          <button
            type="button"
            className="btn btn-outline-secondary d-md-none p-2 d-flex align-items-center"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            <i className={`bi ${menuOpen ? 'bi-x-lg' : 'bi-list'} fs-5`}></i>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="d-md-none border-top border-secondary px-3 pt-2 pb-4" style={{ backgroundColor: PAGE_BG }}>
          <div className="list-group list-group-flush">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className="list-group-item list-group-item-action bg-transparent text-light border-secondary fw-medium d-flex align-items-center gap-2"
              >
                {link.live && <span className="spinner-grow spinner-grow-sm text-success" role="status" aria-hidden="true" style={{ width: 8, height: 8 }}></span>}
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;