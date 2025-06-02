import { useEffect, useState } from 'react';
import { Transaction } from '../types';
import { fetchTransactionsList } from '../services/dataService';
import { groupByDate } from '../utils/groupByDate';

export default function TransactionsList() {
  const [transactionData, setTransactionData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchTransactionsList();
        setTransactionData(data);
      } catch (err) {
        setError('Failed to load transactions.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading transactions...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const grouped = groupByDate(transactionData);

  return (
    <div className="p-4">
      {Object.entries(grouped)
        .sort(([, a], [, b]) => (a.rawDate < b.rawDate ? 1 : -1))
        .map(([dateLabel, { transactions, totalDebit }]) => (
          <div key={dateLabel} className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-800">{dateLabel}</h2>
              <span className="text-red-600 font-medium">-${totalDebit.toFixed(2)}</span>
            </div>
            <table className="w-full border border-gray-200 bg-white rounded shadow-md">
              {/* <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left border-b">Description</th>
                  <th className="px-4 py-2 text-left border-b">Category</th>
                  <th className="px-4 py-2 text-right border-b">Amount</th>
                </tr>
              </thead> */}
              <tbody>
                {transactions.map((item) => {
                  const amount = parseFloat(item.debit || item.credit || "0");
                  const isCredit = Boolean(item.credit);
                  const amountFormatted = `${isCredit ? "+" : "-"}$${amount.toFixed(2)}`;
                  const amountColor = isCredit ? "text-green-600" : "text-gray-600";

                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{item.name}<br/>
                        <span className='text-gray-400'>{item.time}</span>
                        {item.description ? <span className='text-gray-400'>, {item.description}</span>: null }    
                      </td>
                      <td className="px-4 py-2 border-b">{item.category || "-"}</td>
                      <td className={`px-4 py-2 border-b text-right font-medium ${amountColor}`}>
                        {amountFormatted}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
}
