import React, { useEffect, useRef, useState } from 'react';

const COLORS = { BUY: '#10b981', SELL: '#ef4444', CMP: '#60a5fa' };
const fmt = (value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

function dateLabel(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isFinite(date.getTime())
    ? date.toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: '2-digit', timeZone: 'Asia/Kolkata'
      })
    : '';
}

function midpoint(start, end) {
  if (!start || !end) return null;
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  return Number.isFinite(a) && Number.isFinite(b)
    ? new Date(a + (b - a) / 2)
    : null;
}

// Keep every transaction point, but only print as many labels as fit.
function getLabelIndexes(count, plotWidth) {
  const maxLabels = Math.max(2, Math.floor(plotWidth / 82) + 1);
  const visible = Math.min(count, maxLabels);
  if (visible <= 1) return new Set(count ? [0] : []);
  return new Set(Array.from({ length: visible }, (_, i) =>
    Math.round(i * (count - 1) / (visible - 1))));
}

export default function PriceChart({
  title, subtitle, points = [], priceSource, size = 'normal', onActivate
}) {
  const plotRef = useRef(null);
  const [width, setWidth] = useState(440);
  const [activeIndex, setActiveIndex] = useState(null);

  // Measure the actual available width, rather than growing the SVG with data.
  useEffect(() => {
    const node = plotRef.current;
    if (!node) return undefined;
    const measure = () => setWidth(Math.max(1, Math.round(node.clientWidth)));
    measure();
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(measure);
      observer.observe(node);
      return () => observer.disconnect();
    }
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const valid = points.filter((p) => Number.isFinite(p.price) && p.price > 0);
  const compact = size === 'compact';
  const height = size === 'expanded' ? 270 : compact ? 120 : 195;
  const left = Math.min(46, width * 0.16);
  const right = Math.min(40, width * 0.14);
  const top = compact ? 13 : 25;
  const bottom = 39;
  const plotWidth = Math.max(1, width - left - right);
  const plotHeight = height - top - bottom;
  const prices = valid.map((p) => p.price);
  const min = valid.length ? Math.min(...prices) : 0;
  const max = valid.length ? Math.max(...prices) : 1;
  const pad = Math.max((max - min) * 0.15, max * 0.025, 1);
  const low = Math.max(0, min - pad);
  const high = max + pad;
  const getY = (price) => top + (high - price) / (high - low) * plotHeight;
  const coords = valid.map((p, i) => ({
    ...p,
    x: valid.length === 1 ? left + plotWidth / 2 : left + i * plotWidth / (valid.length - 1),
    y: getY(p.price),
    date: midpoint(p.startDate, p.endDate)
  }));
  const labelIndexes = getLabelIndexes(coords.length, plotWidth);
  const markerRadius = coords.length > 24 ? 2 : coords.length > 10 ? 3 : 4.5;
  const showPriceLabels = !compact && coords.length <= 3 &&
    (coords.length <= 1 || plotWidth / (coords.length - 1) >= 66);
  const active = activeIndex == null ? null : coords[activeIndex] || null;
  const hasDates = coords.some((p) => p.date);

  // Any vertical position over the plot selects the closest transaction in X.
  function selectNearest(event) {
    if (!coords.length) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width) return;
    const x = (event.clientX - bounds.left) * width / bounds.width;
    const fraction = Math.max(0, Math.min(1, (x - left) / plotWidth));
    setActiveIndex(Math.round(fraction * (coords.length - 1)));
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      setActiveIndex(null);
      return;
    }
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) || !coords.length) return;
    event.preventDefault();
    event.stopPropagation();
    onActivate?.();
    setActiveIndex((previous) => {
      if (event.key === 'Home') return 0;
      if (event.key === 'End') return coords.length - 1;
      if (previous == null) return event.key === 'ArrowLeft' ? coords.length - 1 : 0;
      return Math.max(0, Math.min(coords.length - 1, previous + (event.key === 'ArrowRight' ? 1 : -1)));
    });
  }

  return (
    <div className="rounded-3 border border-secondary p-3 tl-price-card" style={{ backgroundColor: '#0b0f19' }}>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-1">
        <h4 className="h6 text-light mb-0">{title}</h4>
        <div className="d-flex gap-2 small font-monospace">
          {Object.entries(COLORS).filter(([type]) => valid.some((p) => p.type === type)).map(([type, color]) => (
            <span key={type} style={{ color }}>● {type}</span>
          ))}
        </div>
      </div>
      <p className="small text-secondary mb-1">{subtitle}</p>

      <div ref={plotRef} className="tl-price-plot" style={{ height }}>
        {!coords.length ? (
          <div className="d-flex h-100 align-items-center justify-content-center text-secondary small">No price data available.</div>
        ) : (
          <>
            <svg
              width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none"
              role="img" aria-label={`${title}. ${coords.length} points. Use Left and Right arrows to inspect prices.`}
              tabIndex={0} className="tl-price-svg"
              onPointerMove={(event) => { if (event.pointerType !== 'touch') selectNearest(event); }}
              onPointerDown={(event) => { onActivate?.(); selectNearest(event); }}
              onPointerLeave={(event) => { if (event.pointerType !== 'touch') setActiveIndex(null); }}
              onPointerCancel={() => setActiveIndex(null)}
              onFocus={() => { onActivate?.(); setActiveIndex((i) => i ?? 0); }}
              onBlur={() => setActiveIndex(null)}
              onKeyDown={handleKeyDown}
            >
              {/* A transparent background makes the entire chart interactive. */}
              <rect x="0" y="0" width={width} height={height} fill="transparent" />
              {[0, 0.5, 1].map((fraction) => {
                const value = low + (high - low) * fraction;
                const y = getY(value);
                return <g key={fraction}>
                  <line x1={left} x2={width - right} y1={y} y2={y} stroke="#1f2937" strokeDasharray="4 4" />
                  <text x={left - 5} y={y + 3} fontSize="9" textAnchor="end" fill="#94a3b8">{Math.round(value)}</text>
                </g>;
              })}
              {coords.map((p, i) => {
                if (i === 0) return null;
                const prev = coords[i - 1];
                const isCmp = p.type === 'CMP';
                const stroke = isCmp ? '#3b82f6' : p.price >= prev.price ? '#10b981' : '#ef4444';
                return <line key={`line-${i}`} x1={prev.x} y1={prev.y} x2={p.x} y2={p.y}
                  stroke={stroke} strokeWidth="2" strokeDasharray={isCmp ? '5 5' : undefined} strokeLinecap="round" />;
              })}
              {coords.map((p, i) => (
                <g key={`point-${i}`}>
                  <circle cx={p.x} cy={p.y} r={markerRadius} fill={COLORS[p.type] || '#94a3b8'} />
                  {showPriceLabels && <text x={p.x} y={p.y - 10} textAnchor="middle" fill={COLORS[p.type] || '#94a3b8'} fontSize="10" fontWeight="bold">{fmt(p.price)}</text>}
                  {labelIndexes.has(i) && <>
                    <text x={p.x} y={height - 22} textAnchor="middle" fill="#94a3b8" fontSize="10">{p.label}</text>
                    <text x={p.x} y={height - 8} textAnchor="middle" fill="#94a3b8" fontSize="9">{p.type === 'CMP' ? 'Snapshot' : dateLabel(p.date)}</text>
                  </>}
                </g>
              ))}
              {active && <g pointerEvents="none">
                <line x1={active.x} x2={active.x} y1={top - 5} y2={height - bottom} stroke="#94a3b8" strokeDasharray="4 4" />
                <line x1={left} x2={width - right} y1={active.y} y2={active.y} stroke="#475569" strokeDasharray="3 4" />
                <circle cx={active.x} cy={active.y} r="6" fill={COLORS[active.type] || '#94a3b8'} stroke="#f1f5f9" strokeWidth="1.5" />
              </g>}
            </svg>
            {active && (
              <div className={`tl-chart-tooltip ${active.x > width / 2 ? 'tl-tooltip-left' : 'tl-tooltip-right'}`} role="status">
                <div className="fw-semibold" style={{ color: COLORS[active.type] || '#f1f5f9' }}>{active.label} · {fmt(active.price)}</div>
                {active.date && <div>{dateLabel(active.date)}{active.orderCount > 1 ? ' (midpoint)' : ''}</div>}
                {active.qty != null && <div>Quantity: {active.qty}{active.orderCount != null ? ` · Orders: ${active.orderCount}` : ''}</div>}
                {active.orderCount > 1 && active.startDate && active.endDate && <div>Period: {dateLabel(active.startDate)} – {dateLabel(active.endDate)}</div>}
                {active.type === 'CMP' && <div>{priceSource || 'Price snapshot'}</div>}
              </div>
            )}
          </>
        )}
      </div>
      {hasDates && <p className="text-secondary small mb-0">Dates are group midpoints. Hover or tap anywhere on the graph for full details.</p>}
    </div>
  );
}
