import React from 'react';
import { LineChart, Layers, FileSpreadsheet, FileText, RotateCcw } from 'lucide-react';

export default function SubNav({
  activeTab,
  setActiveTab,
  tradesCount,
  brokerFileName,
  cmpFileName,
  onReset,
}) {
  const styles = {
    wrapper: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      borderBottom: '1px solid #1e293b',
      paddingBottom: '12px',
    },

    /* ---- TABS ---- */
    tabGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      backgroundColor: '#111827',
      padding: '4px',
      borderRadius: '12px',
      border: '1px solid #1e293b',
    },
    tabBase: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    tabActive: {
      backgroundColor: '#2563eb',
      color: '#ffffff',
      fontWeight: '600',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    },
    tabInactive: {
      backgroundColor: 'transparent',
      color: '#94a3b8',
    },

    /* ---- FILE BADGES ---- */
    badgeRow: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '12px',
      fontSize: '12px',
      fontFamily: 'monospace',
      color: '#94a3b8',
    },
    badge: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      backgroundColor: '#161f33',
      padding: '6px 12px',
      borderRadius: '8px',
      border: '1px solid #1e293b',
      color: '#cbd5e1',
    },
    badgeStrong: {
      color: '#ffffff',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      fontWeight: '700',
    },
    resetBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      background: 'none',
      border: 'none',
      color: '#94a3b8',
      fontSize: '12px',
      fontFamily: 'monospace',
      cursor: 'pointer',
    },
  };

  const tabStyle = (tabName) => ({
    ...styles.tabBase,
    ...(activeTab === tabName ? styles.tabActive : styles.tabInactive),
  });

  return (
    <div style={styles.wrapper}>

      {/* TAB SWITCHER */}
      <div style={styles.tabGroup}>
        <button style={tabStyle('overview')} onClick={() => setActiveTab('overview')}>
          <LineChart size={14} />
          <span>Dashboard Analytics</span>
        </button>
        <button style={tabStyle('journal')} onClick={() => setActiveTab('journal')}>
          <Layers size={14} />
          <span>Trade Journal ({tradesCount})</span>
        </button>
      </div>

      {/* FILE STATUS BADGES */}
      <div style={styles.badgeRow}>
        <span style={styles.badge}>
          <FileSpreadsheet size={14} color="#10b981" />
          Orders: <strong style={styles.badgeStrong}>{brokerFileName}</strong> ({tradesCount} trades)
        </span>

        <span style={styles.badge}>
          <FileText size={14} color="#60a5fa" />
          CMP Feed: <strong style={styles.badgeStrong}>{cmpFileName}</strong>
        </span>

        <button style={styles.resetBtn} onClick={onReset} title="Reset to default sample files">
          <RotateCcw size={14} />
          Reset Demo
        </button>
      </div>

    </div>
  );
}