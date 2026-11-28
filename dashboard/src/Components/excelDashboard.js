import React, { useMemo } from "react";
import StockAnalyticsTable from "./stockAnalyticsTable";
import StockCharts from "./stockCharts";

const ExcelDashboard = ({
  stocks,
  selectedStock,
  onSelect,
  searchQuery,
  transactionCount,
  fileName,
  onReset
}) => {

  const filteredStocks = useMemo(() => {

    const query = searchQuery.trim().toLowerCase();

    return stocks.filter((stock) =>
      stock.symbol.toLowerCase().includes(query) ||
      stock.name.toLowerCase().includes(query)
    );

  }, [stocks, searchQuery]);


  return (

    <div className="container-fluid p-3">

      {/* Imported file information */}

      <div
        className="p-3 rounded mb-3"
        style={{
          backgroundColor: "#111827",
          border: "1px solid #1e293b"
        }}
      >

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

          <div>

            <h5 className="mb-2">
              Portfolio Analytics
            </h5>

            <div className="small text-secondary">

              Source: {fileName}

            </div>

            <div className="small text-secondary">

              {transactionCount} transactions
              {" | "}
              {stocks.length} securities

            </div>

          </div>

          <div className="d-flex gap-2">

            <span className="badge bg-warning text-dark align-self-center">
              Test CMP Data
            </span>

            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={onReset}
            >
              Reset Dashboard
            </button>

          </div>

        </div>

      </div>


      {/* Main dashboard layout */}

      <div className="row g-3">

        {/* Left side: Stock table */}

        <div className="col-12 col-xl-7">

          <StockAnalyticsTable
            stocks={filteredStocks}
            selectedSymbol={selectedStock?.symbol}
            onSelect={onSelect}
          />

        </div>


        {/* Right side: Both graphs */}

        <div className="col-12 col-xl-5">

          {selectedStock ? (

            <StockCharts stock={selectedStock} />

          ) : (

            <div
              className="p-4 rounded"
              style={{
                backgroundColor: "#111827",
                border: "1px solid #1e293b"
              }}
            >

              <p className="text-secondary mb-0">
                Select a stock to view its analytics.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>

  );
};

export default ExcelDashboard;