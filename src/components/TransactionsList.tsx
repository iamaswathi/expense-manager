import { useEffect, useState } from 'react';
import { Transaction } from '../types';
import { fetchTransactionsList } from '../services/dataService';
import { groupByDate } from '../utils/groupByDate';
import { getCategoryIcon } from '../utils/getCategoryIcons';
import { groupByMonthAndDate } from '../utils/groupByMonthAndDate';

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

    // const grouped = groupByDate(transactionData);
    const grouped = groupByMonthAndDate(transactionData);


    return (
        <div className="">
            {Object.entries(grouped)
                .sort((a, b) => b[1].monthDate.getTime() - a[1].monthDate.getTime())
                .map(([monthKey, { totalDebit, monthDate, dates }]) => (
                    <div key={monthKey}>
                        <div className="flex justify-between items-center px-4 py-4">
                        <h2 className="text-xl text-gray-800">
                            {monthKey} 
                        </h2>
                        <span className="">${totalDebit.toFixed(2)}</span>
                        </div>

                        {Object.entries(dates)
                            .sort((a, b) => b[1].date.getTime() - a[1].date.getTime())
                            .map(([dateKey, { transactions, total, isCredit }]) => (
                                <div key={dateKey} className="">
                                    <div className="flex justify-between items-center border-b bg-gray-100 px-4 py-2">
                                        <h3 className="text-md text-gray-700">{dateKey}</h3>
                                        {/* <span className={`font-semibold ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                                            {isCredit ? `` : `${Math.abs(total).toFixed(2)}`}
                                        </span> */}
                                    </div>
                                    <table className="w-full bg-white">
                                        <thead className="bg-gray-100">
                                            {/* <tr>
                  <th className="px-4 py-2 text-left border-b">Description</th>
                  <th className="px-4 py-2 text-left border-b">Category</th>
                  <th className="px-4 py-2 text-right border-b">Amount</th>
                </tr> */}
                                        </thead>
                                        <tbody>
                                            {transactions.map((item) => {
                                                const amount = parseFloat(item.debit || item.credit || "0");
                                                const isCredit = Boolean(item.credit);
                                                const amountFormatted = `${isCredit ? "+" : ""}$${amount.toFixed(2)}`;
                                                const amountColor = isCredit ? "text-green-600" : "text-gray-600";

                                                return (
                                                    <tr key={item.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-2 border-b">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-5 h-5 text-blue-500">{getCategoryIcon(item.category)}</span>
                                                                <span className="">{item.name}<br />
                                                                    <span className='text-gray-400'>{item.time}</span>
                                                                    {item.description ? <span className='text-gray-400'>, {item.description}</span> : null}
                                                                </span>
                                                            </div>
                                                        </td>
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
                ))}
        </div>
    );
}
