import React from 'react';

import SubNav from './subNav';
import KpiCards from './kpiCards';
import TradeTable from './tradeTable';
import TradeChart from './tradeChart';

function Home({
    activeTab,
    setActiveTab,
    tradesCount,
    brokerFileName,
    cmpFileName,
    onReset,
    summaryMetrics,
    filteredTrades,
    selectedTrade,
    setSelectedId,
    tableFilter,
    setTableFilter
}) {
    return (
        <div className="container-fluid p-4">

            <SubNav
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tradesCount={tradesCount}
                brokerFileName={brokerFileName}
                cmpFileName={cmpFileName}
                onReset={onReset}
            />

            <div className="mt-4">
                <KpiCards summaryMetrics={summaryMetrics} />
            </div>

            <div className="row g-4 mt-1">

                <div className="col-12 col-lg-7">
                    <TradeTable
                        trades={filteredTrades}
                        selectedId={selectedTrade?.id}
                        onSelect={setSelectedId}
                        tableFilter={tableFilter}
                        setTableFilter={setTableFilter}
                    />
                </div>

                <div className="col-12 col-lg-5">
                   {selectedTrade && (
    <TradeChart trade={selectedTrade} />
)}
                </div>

            </div>

        </div>
    );
}

export default Home;