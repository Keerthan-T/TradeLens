export function groupTransactions(transactions) {

  // Sort the complete order history chronologically
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const groups = [];

  for (const transaction of sortedTransactions) {

    const lastGroup = groups[groups.length - 1];

    const canMerge =
      lastGroup &&
      lastGroup.symbol === transaction.symbol &&
      lastGroup.type === transaction.type;

    if (canMerge) {

      lastGroup.qty += transaction.qty;

      lastGroup.totalValue +=
        transaction.price * transaction.qty;

      lastGroup.averagePrice =
        lastGroup.totalValue / lastGroup.qty;

      lastGroup.endDate = transaction.date;

      lastGroup.orderCount += 1;

      lastGroup.orders.push(transaction);

    } else {

      groups.push({
        id: `GROUP-${groups.length + 1}`,

        symbol: transaction.symbol,
        type: transaction.type,

        qty: transaction.qty,

        totalValue:
          transaction.price * transaction.qty,

        averagePrice: transaction.price,

        startDate: transaction.date,
        endDate: transaction.date,

        orderCount: 1,

        orders: [transaction]
      });

    }

  }

  return groups;
}


