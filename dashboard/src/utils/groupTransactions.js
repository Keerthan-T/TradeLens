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
const testTransactions = [
  {
    symbol: 'HINDCOPPER',
    type: 'BUY',
    qty: 5,
    price: 500,
    date: '2026-11-16'
  },
  {
    symbol: 'HINDCOPPER',
    type: 'BUY',
    qty: 5,
    price: 520,
    date: '2026-11-17'
  },
  {
    symbol: 'TATASTEEL',
    type: 'BUY',
    qty: 10,
    price: 150,
    date: '2026-11-18'
  },
  {
    symbol: 'HINDCOPPER',
    type: 'BUY',
    qty: 10,
    price: 550,
    date: '2026-11-19'
  },
  {
    symbol: 'HINDCOPPER',
    type: 'BUY',
    qty: 5,
    price: 580,
    date: '2026-11-20'
  },
  {
    symbol: 'HINDCOPPER',
    type: 'SELL',
    qty: 25,
    price: 600,
    date: '2026-11-23'
  }
];

console.table(groupTransactions(testTransactions));