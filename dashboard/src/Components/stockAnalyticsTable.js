import React from "react";

const StockAnalyticsTable = ({
  stocks,
  selectedSymbol,
  onSelect
}) => {

  const formatPrice = (value) => {

    if (value == null) return "N/A";

    return `₹${value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

  };


  const profitColor = (value) => {

    if (value == null || value === 0) {
      return "#94a3b8";
    }

    return value > 0 ? "#22c55e" : "#ef4444";

  };


  const statusColor = {
    HOLDING: "#22c55e",
    "PARTIALLY SOLD": "#f59e0b",
    "FULLY EXITED": "#38bdf8",
    INCOMPLETE: "#ef4444"
  };


  return (

    <div
      className="p-3 rounded"
      style={{
        backgroundColor: "#111827",
        border: "1px solid #1e293b"
      }}
    >

      <h5 className="mb-2">

        Stock Analytics

        <span className="text-secondary ms-2">
          ({stocks.length})
        </span>

      </h5>

      <p className="text-secondary small">
        Select a stock to view both price graphs.
      </p>


      <div
        className="table-responsive"
        style={{
          maxHeight: "850px",
          overflowY: "auto"
        }}
      >

        <table
          className="table table-dark table-hover align-middle mb-0"
          style={{
            fontSize: "13px",
            whiteSpace: "nowrap"
          }}
        >

          <thead
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1
            }}
          >

            <tr>

              <th>Stock</th>
              <th>Holding</th>
              <th>Avg Buy</th>
              <th>Avg Sell</th>
              <th>CMP</th>
              <th>Realized P&L</th>
              <th>Status</th>

            </tr>

          </thead>


          <tbody>

            {stocks.map((stock) => {

              const isSelected =
                selectedSymbol === stock.symbol;

              return (

                <tr
                  key={stock.symbol}
                  onClick={() => onSelect(stock.symbol)}
                  className={isSelected ? "table-active" : ""}
                  style={{ cursor: "pointer" }}
                >

                  <td
                    style={{
                      borderLeft: isSelected
                        ? "3px solid #38bdf8"
                        : "3px solid transparent"
                    }}
                  >

                    <button
                      type="button"
                      className="btn btn-link text-decoration-none p-0 fw-bold"
                      aria-pressed={isSelected}
                      style={{
                        fontSize: "13px",
                        color: isSelected
                          ? "#38bdf8"
                          : "#f1f5f9"
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(stock.symbol);
                      }}
                    >
                      {stock.symbol}
                    </button>

                    <div
                      className="text-secondary"
                      style={{
                        fontSize: "10px",
                        maxWidth: "140px",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      {stock.name}
                    </div>

                  </td>


                  <td>
                    {stock.holdingQty}
                  </td>


                  <td>
                    {formatPrice(stock.averageBuyPrice)}
                  </td>


                  <td>
                    {formatPrice(stock.averageSellPrice)}
                  </td>


                  <td>
                    {formatPrice(stock.currentPrice)}
                  </td>


                  <td
                    style={{
                      color: profitColor(stock.realizedPnL)
                    }}
                  >
                    {formatPrice(stock.realizedPnL)}
                  </td>


                  <td>

                    <span
                      style={{
                        color: statusColor[stock.status],
                        fontSize: "10px",
                        fontWeight: "600"
                      }}
                    >
                      {stock.status}
                    </span>

                  </td>

                </tr>

              );

            })}


            {stocks.length === 0 && (

              <tr>

                <td
                  colSpan="7"
                  className="text-center text-secondary p-4"
                >

                  No matching stocks found.

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default StockAnalyticsTable;