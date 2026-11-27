import { readSheet } from 'read-excel-file/browser';

// Convert Groww date format into a JavaScript Date
function parseGrowwDate(value) {

  const match = String(value).trim().match(
    /^(\d{2})-(\d{2})-(\d{4})\s+(\d{1,2}):(\d{2})\s+(AM|PM)$/i
  );

  if (!match) {
    throw new Error(`Invalid execution date: ${value}`);
  }

  const [, day, month, year, hour, minute, period] = match;

  let hours = Number(hour) % 12;

  if (period.toUpperCase() === 'PM') {
    hours += 12;
  }

  return new Date(
    `${year}-${month}-${day}T${String(hours).padStart(2, '0')}:${minute}:00+05:30`
  );
}


// Read and normalize Groww Excel orders
export async function parseGrowwExcel(file) {

  const rows = await readSheet(file, 1);

  // Find the actual header row
 const headerIndex = rows.findIndex(
  (row) =>
    String(row[0]).trim().toLowerCase() === 'stock name' &&
    String(row[1]).trim().toLowerCase() === 'symbol'
);

console.log("Header index:", headerIndex);
console.log("Headers:", rows[headerIndex]);

  if (headerIndex === -1) {
    throw new Error('Invalid Groww order history format.');
  }

  const transactions = rows
    .slice(headerIndex + 1)

    // Ignore non-executed orders
    .filter((row) =>
      String(row[9]).trim().toLowerCase() === 'executed'
    )

    .map((row, index) => {

      const qty = Number(row[4]);
      const totalValue = Number(row[5]);

      const symbol = String(row[1] || '').trim().toUpperCase();
      const type = String(row[3]).trim().toUpperCase();

      if (
        !symbol ||
        !['BUY', 'SELL'].includes(type) ||
        !Number.isInteger(qty) ||
        qty <= 0 ||
        !Number.isFinite(totalValue) ||
        totalValue <= 0
      ) {
        throw new Error(`Invalid transaction at record ${index + 1}`);
      }

      const date = parseGrowwDate(row[8]);

      return {
        id: `ORDER-${index + 1}`,

        name: String(row[0] || symbol),
        symbol,
        isin: String(row[2] || ''),
        type,

        qty,
        totalValue,

        price: totalValue / qty,

        exchange: String(row[6] || ''),
        orderId: String(row[7] || ''),

        date: date.toISOString(),

        status: 'Executed'
      };

    });

  if (!transactions.length) {
    throw new Error('No executed transactions found.');
  }

  // Sort the complete order history
  transactions.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return transactions;
}