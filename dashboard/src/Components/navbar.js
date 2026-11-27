import React, { useState } from 'react';
import { BarChart2, Search, Upload, RefreshCw } from 'lucide-react';

export default function Navbar({ searchQuery, setSearchQuery, onImportClick }) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const styles = {
    header: {
      position: 'sticky',
      top: 0,
      zIndex: 40,
      backgroundColor: 'rgba(13, 19, 34, 0.95)',
      borderBottom: '1px solid #1e293b',
      backdropFilter: 'blur(8px)',
    },
    inner: {
      maxWidth: '1600px',
      margin: '0 auto',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
      gap: '16px',
    },

    /* ---- LOGO ---- */
    logoWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    logoIconOuter: {
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      background: 'linear-gradient(135deg, #2563eb, #10b981)',
      padding: '1.5px',
      boxShadow: '0 0 12px rgba(16,185,129,0.15)',
    },
    logoIconInner: {
      width: '100%',
      height: '100%',
      backgroundColor: '#0b0f19',
      borderRadius: '9px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoText: {
      display: 'flex',
      flexDirection: 'column',
    },
    logoTitle: {
      fontSize: '18px',
      fontWeight: '800',
      color: '#ffffff',
      letterSpacing: '-0.5px',
      lineHeight: 1,
    },
    logoGreen: {
      color: '#10b981',
    },
    logoSub: {
      fontSize: '9px',
      fontFamily: 'monospace',
      letterSpacing: '2px',
      color: '#94a3b8',
      textTransform: 'uppercase',
      marginTop: '2px',
    },

    /* ---- SEARCH ---- */
    searchWrapper: {
      flex: 1,
      maxWidth: '420px',
      margin: '0 24px',
      position: 'relative',
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8',
    },
    searchInput: {
      width: '100%',
      backgroundColor: '#161f33',
      border: '1px solid #1e293b',
      borderRadius: '10px',
      padding: '8px 16px 8px 36px',
      fontSize: '12px',
      color: '#e2e8f0',
      fontFamily: 'monospace',
      outline: 'none',
    },

    /* ---- RIGHT ACTIONS ---- */
    rightActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    syncBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 12px',
      borderRadius: '8px',
      backgroundColor: '#161f33',
      border: '1px solid #1e293b',
      color: '#cbd5e1',
      fontSize: '11px',
      fontFamily: 'monospace',
      cursor: 'pointer',
    },
    syncDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#10b981',
    },
    uploadBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: '10px',
      backgroundColor: '#2563eb',
      border: '1px solid rgba(96,165,250,0.3)',
      color: '#ffffff',
      fontSize: '13px',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: '0 4px 14px rgba(37,99,235,0.25)',
    },
    avatar: {
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      backgroundColor: '#1e293b',
      border: '1px solid #334155',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '700',
      fontSize: '11px',
      color: '#10b981',
    },
  };

  return (
    <header style={styles.header}>
      <div style={styles.inner}>

        {/* LOGO */}
        <div style={styles.logoWrapper}>
          <div style={styles.logoIconOuter}>
            <div style={styles.logoIconInner}>
              <BarChart2 size={16} color="#10b981" />
            </div>
          </div>
          <div style={styles.logoText}>
            <span style={styles.logoTitle}>
              Trade<span style={styles.logoGreen}>Lens</span>
            </span>
            <span style={styles.logoSub}>Post-Trade Analytics</span>
          </div>
        </div>

        {/* SEARCH */}
        <div style={styles.searchWrapper}>
          <span style={styles.searchIcon}>
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Search ticker or company name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* RIGHT ACTIONS */}
        <div style={styles.rightActions}>

          {/* Sync Status */}
          <button style={styles.syncBtn} onClick={handleSync}>
            <span style={styles.syncDot} />
            <span>Import Status: Active</span>
            <RefreshCw
              size={13}
              color={isSyncing ? '#3b82f6' : '#94a3b8'}
              style={{ marginLeft: '4px' }}
            />
          </button>

          {/* Upload Button */}
          <button style={styles.uploadBtn} onClick={onImportClick}>
            <Upload size={15} />
            <span>Upload Trades & CMP</span>
          </button>

          {/* Avatar */}
          <div style={styles.avatar}>AK</div>

        </div>
      </div>
    </header>
  );
}