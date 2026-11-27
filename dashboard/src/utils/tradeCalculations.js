import { fifoMatching } from "./fifoMatching";
import { groupTransactions } from "./groupTransactions";

export function calculateStockAnalytics(
  transactions,
  cmpMap = {}
) {

  const stockSummaries = fifoMatching(transactions);

  const groupedTransactions =
    groupTransactions(transactions);

  return stockSummaries.map((stock) => {

    // Get current market price
    const rawPrice = Number(cmpMap[stock.symbol]);

    const currentPrice =
      Number.isFinite(rawPrice) && rawPrice > 0
        ? rawPrice
        : null;

    const hasCMP = currentPrice !== null;

    // Get transaction groups for this stock
    const stockGroups = groupedTransactions.filter(
      (group) => group.symbol === stock.symbol
    );

    // Current holdings value
    const holdingValue =
      stock.holdingQty === 0
        ? 0
        : hasCMP
          ? stock.holdingQty * currentPrice
          : null;

    // Unrealized profit or loss
    const unrealizedPnL =
      holdingValue !== null
        ? holdingValue - stock.holdingCost
        : null;

    // Realized return percentage
    const realizedReturn =
      stock.soldCost > 0
        ? (stock.realizedPnL / stock.soldCost) * 100
        : null;

    // Unrealized return percentage
    const unrealizedReturn =
      stock.holdingCost > 0 && unrealizedPnL !== null
        ? (unrealizedPnL / stock.holdingCost) * 100
        : null;

    // Combined profit
    const totalPnL =
      unrealizedPnL !== null
        ? stock.realizedPnL + unrealizedPnL
        : null;

    // Post-sale analysis
    let missedProfit = null;
    let lossAvoided = null;

    if (hasCMP && stock.matchedSoldQty > 0) {

      missedProfit = 0;
      lossAvoided = 0;

      for (const trade of stock.completedTrades) {

        const difference =
          (currentPrice - trade.sellPrice) * trade.qty;

        if (difference > 0) {
          missedProfit += difference;
        } else {
          lossAvoided += Math.abs(difference);
        }
      }
    }

    // GRAPH 1: Overall weighted average
    const averageGraph = [];

    if (stock.averageBuyPrice !== null) {
      averageGraph.push({
        label: "Avg Buy",
        price: stock.averageBuyPrice,
        type: "BUY",
        qty: stock.totalBoughtQty
      });
    }

    if (stock.averageSellPrice !== null) {
      averageGraph.push({
        label: "Avg Sell",
        price: stock.averageSellPrice,
        type: "SELL",
        qty: stock.totalSoldQty
      });
    }

    if (hasCMP) {
      averageGraph.push({
        label: "CMP",
        price: currentPrice,
        type: "CMP"
      });
    }

    // GRAPH 2: Grouped transaction history
    let buyCount = 0;
    let sellCount = 0;

    const transactionGraph = stockGroups.map(
      (group) => {

        const label =
          group.type === "BUY"
            ? `Buy ${++buyCount}`
            : `Sell ${++sellCount}`;

        return {
          label,
          price: group.averagePrice,
          type: group.type,
          qty: group.qty,

          startDate: group.startDate,
          endDate: group.endDate,

          orderCount: group.orderCount
        };
      }
    );

    if (hasCMP) {
      transactionGraph.push({
        label: "CMP",
        price: currentPrice,
        type: "CMP"
      });
    }

    return {
      ...stock,

      currentPrice,

      holdingValue,
      unrealizedPnL,
      realizedReturn,
      unrealizedReturn,
      totalPnL,

      missedProfit,
      lossAvoided,

      averageGraph,
      transactionGraph
    };

  });
}