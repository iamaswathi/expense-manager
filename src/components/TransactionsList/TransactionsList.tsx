import { useEffect, useState } from 'react';
import { fetchTransactionsList } from '../../services/dataService';
import { getCategoryIcon } from '../../utils/getCategoryIcons';
import { groupByMonthAndDate } from '../../utils/groupByMonthAndDate';
import { Transaction } from '../../utils/interface/transactionInterface';

export default function TransactionsList() {
    const [transactionData, setTransactionData] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchTransactionsList();
                console.log(data);
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

    const grouped = groupByMonthAndDate(transactionData);

    // function removeCreditDebitSign(arg0: number) {
    //     throw new Error('Function not implemented.');
    // }
    const removeCreditDebitSign = (transactionValue: string) => {
        return transactionValue.slice(1);
    }
    const getTimeFromDateString = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    }

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
                                        </thead>
                                        <tbody>
                                            {transactions.map((item) => {
                                                const amount = parseFloat(removeCreditDebitSign(item.attributes.amount.value)).toFixed(2);
                                                const amountFormatted = `${item.attributes.amount.value.startsWith('+') ? "+" : ""}$${amount}`;
                                                const amountColor = item.attributes.amount.value.startsWith('+') ? "text-green-600" : "text-gray-600";

                                                return (
                                                    <tr key={item.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-2 border-b">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-5 h-5 text-blue-500">{getCategoryIcon('food')}</span>
                                                                <span className="">{item.attributes.description}<br />
                                                                    <span className='text-gray-400'>{getTimeFromDateString(item.attributes.createdAt)}</span>
                                                                    {item.attributes.message ? <span className='text-gray-400'>, {item.attributes.message}</span> : <span className='text-gray-400'>, {item.attributes.performingCustomer.displayName}</span>}
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
