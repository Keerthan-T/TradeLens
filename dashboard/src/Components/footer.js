import React from 'react';

export default function Footer() {
  return (
    <footer
      className="text-center border-top border-secondary py-3 mt-auto"
      style={{
        backgroundColor: '#0d1322',
        color: '#94a3b8',
        fontSize: '12px',
      }}
    >
      <span className="font-monospace">
        TradeLens Analytics Workspace
        {' • '}
        Post-Trade Analytics Engine
      </span>
    </footer>
  );
}