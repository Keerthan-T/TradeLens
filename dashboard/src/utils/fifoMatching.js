export function fifoMatching(transactions) {

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const stockMap = new Map();

  for (const order of sortedTransactions) {

    const { symbol, type, qty, price } = order;

    // Initialize a stock record
    if (!stockMap.has(symbol)) {
      stockMap.set(symbol, {
        symbol,
        name: order.name || symbol,

        totalBoughtQty: 0,
        totalSoldQty: 0,

        totalBuyValue: 0,
        totalSellValue: 0,

        matchedSoldQty: 0,
        matchedSellValue: 0,
        soldCost: 0,
        realizedPnL: 0,

        unmatchedSellQty: 0,

        buyQueue: [],
        completedTrades: []
      });
    }

    const stock = stockMap.get(symbol);

    // Handle BUY orders
    if (type === "BUY") {

      stock.totalBoughtQty += qty;
      stock.totalBuyValue += qty * price;

      stock.buyQueue.push({
        qty,
        price,
        date: order.date,
        orderId: order.id
      });

    }

    // Handle SELL orders
    else if (type === "SELL") {

      stock.totalSoldQty += qty;
      stock.totalSellValue += qty * price;

      let remainingSellQty = qty;

      while (
        remainingSellQty > 0 &&
        stock.buyQueue.length > 0
      ) {

        const oldestBuy = stock.buyQueue[0];

        const matchedQty = Math.min(
          oldestBuy.qty,
          remainingSellQty
        );

        const buyCost = matchedQty * oldestBuy.price;
        const sellValue = matchedQty * price;
        const profit = sellValue - buyCost;

        stock.soldCost += buyCost;
        stock.matchedSoldQty += matchedQty;
        stock.matchedSellValue += sellValue;
        stock.realizedPnL += profit;

        stock.completedTrades.push({
          qty: matchedQty,
          buyPrice: oldestBuy.price,
          sellPrice: price,
          buyDate: oldestBuy.date,
          sellDate: order.date,
          realizedPnL: profit
        });

        oldestBuy.qty -= matchedQty;
        remainingSellQty -= matchedQty;

        // Remove fully sold purchase batch
        if (oldestBuy.qty === 0) {
          stock.buyQueue.shift();
        }
      }

      // Detect incomplete transaction history
      if (remainingSellQty > 0) {
        stock.unmatchedSellQty += remainingSellQty;
      }
    }
  }

  // Calculate consolidated stock summaries
  return Array.from(stockMap.values()).map((stock) => {

    const holdingQty = stock.buyQueue.reduce(
      (sum, order) => sum + order.qty,
      0
    );

    const holdingCost = stock.buyQueue.reduce(
      (sum, order) => sum + order.qty * order.price,
      0
    );

    const averageBuyPrice =
      stock.totalBoughtQty > 0
        ? stock.totalBuyValue / stock.totalBoughtQty
        : null;

    const averageSellPrice =
      stock.totalSoldQty > 0
        ? stock.totalSellValue / stock.totalSoldQty
        : null;

    const averageHoldingPrice =
      holdingQty > 0
        ? holdingCost / holdingQty
        : null;

    const averageSoldBuyPrice =
      stock.matchedSoldQty > 0
        ? stock.soldCost / stock.matchedSoldQty
        : null;

    let status;

    if (stock.unmatchedSellQty > 0) {
      status = "INCOMPLETE";
    } else if (stock.totalSoldQty === 0) {
      status = "HOLDING";
    } else if (holdingQty > 0) {
      status = "PARTIALLY SOLD";
    } else {
      status = "FULLY EXITED";
    }

    return {
      ...stock,

      holdingQty,
      holdingCost,

      averageBuyPrice,
      averageSellPrice,
      averageHoldingPrice,
      averageSoldBuyPrice,

      status
    };
  });
}