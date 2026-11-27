import React from 'react';
import { BrainCircuit } from 'lucide-react';
import { formatINR } from '../utils/formatINR';

const PANEL_BG = '#111827';
const INNER_BG = '#0b0f19';

export default function TradeChart({ trade }) {

  if (!trade) return null;

  // Financial calculations
  const realized =
    (trade.sellPrice - trade.buyPrice) * trade.qty;

  const missed = Math.max(
    0,
    (trade.currentPrice - trade.sellPrice) * trade.qty
  );

  const missedPct = trade.sellPrice
    ? Math.max(
        0,
        ((trade.currentPrice - trade.sellPrice) /
          trade.sellPrice) * 100
      )
    : 0;

  const totalPct = trade.buyPrice
    ? ((trade.currentPrice - trade.buyPrice) /
        trade.buyPrice) * 100
    : 0;

  const realizedPct = trade.buyPrice
    ? ((trade.sellPrice - trade.buyPrice) /
        trade.buyPrice) * 100
    : 0;

  const efficiency = totalPct > 0
    ? Math.round(
        Math.min(100, Math.max(0, (realizedPct / totalPct) * 100))
      )
    : null;


  // Selling decision assessment
  const assessment =
    trade.category === 'early'
      ? `You exited ${trade.symbol} at ₹${trade.sellPrice}. 
         The stock gained an additional ${missedPct.toFixed(1)}% post-sale.`

      : trade.currentPrice < trade.sellPrice
      ? `The current price of ${trade.symbol} is below your selling price.`

      : 'The stock has shown limited additional upside since your exit.';


  // Dynamic graph coordinates
  const prices = [
    trade.buyPrice,
    trade.sellPrice,
    trade.currentPrice
  ];

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const priceRange = maxPrice - minPrice;

  const getY = (price) => {
    if (priceRange === 0) return 90;

    return 150 - ((price - minPrice) / priceRange) * 120;
  };

  const buyY = getY(trade.buyPrice);
  const sellY = getY(trade.sellPrice);
  const cmpY = getY(trade.currentPrice);

  // Dynamic line colours
  const holdColor =
    trade.sellPrice >= trade.buyPrice
      ? '#10b981'
      : '#ef4444';

  const postExitColor =
    trade.currentPrice >= trade.sellPrice
      ? '#3b82f6'
      : '#ef4444';


  return (
    <div
      className="card h-100 rounded-4 border-secondary shadow-lg"
      style={{ backgroundColor: PANEL_BG }}
    >
      <div className="card-body p-4 d-flex flex-column gap-3">

        {/* Stock Header */}
        <div className="d-flex align-items-center justify-content-between pb-3 border-bottom border-secondary">

          <div className="d-flex align-items-center gap-3">

            <span
              className="d-inline-flex align-items-center justify-content-center rounded-3 border border-warning bg-warning bg-opacity-10 text-warning fw-bold font-monospace"
              style={{
                width: 40,
                height: 40,
                fontSize: '0.875rem'
              }}
            >
              {trade.symbol.substring(0, 2)}
            </span>

            <div>
              <h3 className="h6 fw-bold text-white mb-0">
                {trade.name}
              </h3>

              <p className="small text-secondary font-monospace mb-0">
                Buy: ₹{trade.buyPrice} |
                Exit: ₹{trade.sellPrice} |
                CMP: ₹{trade.currentPrice}
              </p>
            </div>

          </div>

          <span className="small font-monospace bg-secondary bg-opacity-25 text-light border border-secondary rounded px-2 py-1">
            {trade.symbol}
          </span>

        </div>


        {/* Dynamic Price Graph */}
        <div
          className="rounded-3 border border-secondary p-3"
          style={{ backgroundColor: INNER_BG }}
        >

          {/* Graph Legend */}
          <div className="d-flex justify-content-between small font-monospace mb-3">

            <span
              className="d-flex align-items-center gap-1"
              style={{ color: holdColor }}
            >
              ● Hold Period
            </span>

            <span
              className="d-flex align-items-center gap-1"
              style={{ color: postExitColor }}
            >
              ● Post-Exit
            </span>

          </div>


          <div style={{ height: 220 }}>

            <svg
              width="100%"
              height="100%"
              viewBox="0 0 500 210"
            >

              {/* Horizontal grid lines */}
              {[30, 90, 150].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="500"
                  y2={y}
                  stroke="#1f2937"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Selling point divider */}
              <line
                x1="250"
                y1="10"
                x2="250"
                y2="170"
                stroke="#ef4444"
                strokeDasharray="3 3"
              />


              {/* Buy to Sell line */}
              <path
                d={`M 60 ${buyY} L 250 ${sellY}`}
                fill="none"
                stroke={holdColor}
                strokeWidth="3"
                strokeLinecap="round"
              />


              {/* Sell to CMP line */}
              <path
                d={`M 250 ${sellY} L 440 ${cmpY}`}
                fill="none"
                stroke={postExitColor}
                strokeWidth="3"
                strokeDasharray="5 5"
                strokeLinecap="round"
              />


              {/* Buy Marker */}
              <circle
                cx="60"
                cy={buyY}
                r="6"
                fill="#10b981"
              />

              <text
                x="60"
                y={buyY - 12}
                textAnchor="middle"
                fill="#10b981"
                fontSize="13"
                fontWeight="bold"
              >
                ₹{trade.buyPrice}
              </text>


              {/* Sell Marker */}
              <circle
                cx="250"
                cy={sellY}
                r="7"
                fill="#ef4444"
              />

              <text
                x="250"
                y={sellY - 12}
                textAnchor="middle"
                fill="#ef4444"
                fontSize="13"
                fontWeight="bold"
              >
                ₹{trade.sellPrice}
              </text>


              {/* CMP Marker */}
              <circle
                cx="440"
                cy={cmpY}
                r="7"
                fill="#3b82f6"
                stroke="#ffffff"
                strokeWidth="2"
              />

              <text
                x="440"
                y={cmpY - 12}
                textAnchor="middle"
                fill="#60a5fa"
                fontSize="13"
                fontWeight="bold"
              >
                ₹{trade.currentPrice}
              </text>


              {/* Bottom Labels */}
              <text
                x="60"
                y="190"
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="12"
              >
                BUY
              </text>

              <text
                x="250"
                y="190"
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="12"
              >
                SELL
              </text>

              <text
                x="440"
                y="190"
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="12"
              >
                CMP
              </text>

            </svg>

          </div>

        </div>


        {/* Selling Decision Assessment */}
        <div
          className="rounded-3 border border-secondary p-3 font-monospace small"
          style={{ backgroundColor: '#161f33' }}
        >

          <div className="d-flex align-items-center justify-content-between mb-3">

            <span className="text-secondary d-flex align-items-center gap-2 fw-medium">
              <BrainCircuit size={16} color="#a78bfa" />
              Selling Decision Assessment
            </span>

            <span className="fw-bold text-info">
              {efficiency === null
                ? 'Efficiency: N/A'
                : `${efficiency}% Efficiency`}
            </span>

          </div>


          <div className="row g-2 text-center mb-3">

            {/* Realized Profit */}
            <div className="col-6">

              <div
                className="rounded-2 border border-secondary p-2"
                style={{ backgroundColor: INNER_BG }}
              >

                <div
                  className="text-secondary"
                  style={{ fontSize: '0.625rem' }}
                >
                  REALIZED PROFIT
                </div>

                <div
                  className={`fw-bold ${
                    realized >= 0
                      ? 'text-success'
                      : 'text-danger'
                  }`}
                >
                  {realized >= 0 ? '+' : ''}
                  {formatINR(realized)}
                </div>

              </div>

            </div>


            {/* Missed Upside */}
            <div className="col-6">

              <div
                className="rounded-2 border border-secondary p-2"
                style={{ backgroundColor: INNER_BG }}
              >

                <div
                  className="text-secondary"
                  style={{ fontSize: '0.625rem' }}
                >
                  MISSED UPSIDE
                </div>

                <div className="fw-bold text-warning">
                  {formatINR(missed)}
                </div>

              </div>

            </div>

          </div>


          <p className="text-light small lh-base mb-0 pt-2 border-top border-secondary">
            {assessment}
          </p>

        </div>

      </div>

    </div>
  );
}