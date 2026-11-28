import React from "react";
import PriceChart from "./priceChart";

const StockCharts = ({ stock }) => {

  if (!stock) return null;

  const formatPrice = (value) => {

    if (value == null) return "N/A";

    return `₹${value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const formatPercent = (value) =>
    value == null
      ? "N/A"
      : `${value.toFixed(2)}%`;

  const profitColor = (value) => {

    if (value == null || value === 0) {
      return "#94a3b8";
    }

    return value > 0 ? "#22c55e" : "#ef4444";
  };

  const metrics = [

    {
      label: "Realized P&L",
      value: formatPrice(stock.realizedPnL),
      color: profitColor(stock.realizedPnL)
    },

    {
      label: "Unrealized P&L",
      value: formatPrice(stock.unrealizedPnL),
      color: profitColor(stock.unrealizedPnL)
    },

    {
      label: "Total P&L",
      value: formatPrice(stock.totalPnL),
      color: profitColor(stock.totalPnL)
    },

    {
      label: "Missed Upside",
      value: formatPrice(stock.missedProfit),
      color: "#f59e0b"
    },

    {
      label: "Loss Avoided",
      value: formatPrice(stock.lossAvoided),
      color: "#22c55e"
    },

    {
      label: "Holding Value",
      value: formatPrice(stock.holdingValue),
      color: "#38bdf8"
    },

    {
      label: "Realized Return",
      value: formatPercent(stock.realizedReturn),
      color: profitColor(stock.realizedReturn)
    },

    {
      label: "Unrealized Return",
      value: formatPercent(stock.unrealizedReturn),
      color: profitColor(stock.unrealizedReturn)
    }

  ];

  return (

    <div className="container-fluid px-3 mb-3">

      {/* Selected stock information */}

      <div
        className="p-3 rounded mb-3"
        style={{
          backgroundColor: "#111827",
          border: "1px solid #1e293b"
        }}
      >

        <div className="d-flex justify-content-between flex-wrap">

          <div>

            <h4 className="mb-1">
              {stock.symbol}
            </h4>

            <p className="text-secondary mb-1">
              {stock.name}
            </p>

            <span className="badge bg-secondary">
              {stock.status}
            </span>

          </div>

          <div className="text-end">

            <small className="text-secondary">
              Current Market Price
            </small>

            <h4 style={{ color: "#38bdf8" }}>
              {formatPrice(stock.currentPrice)}
            </h4>

          </div>

        </div>

        <div className="row mt-3">

          <div className="col">
            <small className="text-secondary">Bought</small>
            <h5>{stock.totalBoughtQty}</h5>
          </div>

          <div className="col">
            <small className="text-secondary">Sold</small>
            <h5>{stock.totalSoldQty}</h5>
          </div>

          <div className="col">
            <small className="text-secondary">Holding</small>
            <h5>{stock.holdingQty}</h5>
          </div>

        </div>

        <small style={{ color: "#f59e0b" }}>
          CMP values are fictional test data.
        </small>

        {stock.unmatchedSellQty > 0 && (
          <p className="text-danger small mt-2 mb-0">
            Incomplete transaction history. Financial
            calculations may be incomplete.
          </p>
        )}

      </div>


      {/* Graph 1 */}

      <PriceChart
        title="Overall Weighted Average"
        subtitle="Historical average purchase price, average selling price and CMP"
        points={stock.averageGraph}
      />


      {/* Graph 2 */}

      <PriceChart
        title="Grouped Transaction History"
        subtitle="Consecutive buying and selling periods in execution order"
        points={stock.transactionGraph}
      />


      {/* Financial metrics */}

      <div
        className="p-3 rounded"
        style={{
          backgroundColor: "#111827",
          border: "1px solid #1e293b"
        }}
      >

        <h5 className="mb-3">
          Stock Performance Analytics
        </h5>

        <div className="row g-3">

          {metrics.map((metric) => (

            <div
              className="col-6 col-md-3"
              key={metric.label}
            >

              <div
                className="p-3 rounded h-100"
                style={{
                  backgroundColor: "#0b0f19",
                  border: "1px solid #1e293b"
                }}
              >

                <small className="text-secondary">
                  {metric.label}
                </small>

                <h5
                  className="mt-2 mb-0"
                  style={{ color: metric.color }}
                >
                  {metric.value}
                </h5>

              </div>

            </div>

          ))}

        </div>

        <p className="small text-secondary mt-3 mb-0">
          Post-sale metrics compare recorded sales with
          CMP. They do not represent actual realized losses
          or historical maximum returns.
        </p>

      </div>

    </div>

  );
};

export default StockCharts;