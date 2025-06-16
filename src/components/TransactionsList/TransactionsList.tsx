import { useEffect, useState } from 'react';
import { fetchTransactionsList } from '../../services/dataService';
import { getCategoryIcon } from '../../utils/getCategoryIcons';
import { groupByMonthAndDate } from '../../utils/groupByMonthAndDate';
import { Transaction } from '../../utils/interface/transactionInterface';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { loadTransactions } from '../../state/transactions/transactionsSlice';

export default function TransactionsList() {

    const dispatch =useAppDispatch();
    const transactionsList = useAppSelector((state) => state.transctions.transactionsList);
    const status = useAppSelector((state) => state.transctions.status);

    useEffect(() => {
        dispatch(loadTransactions());
    }, [dispatch]);

    if(status === 'loading') return <div>Loading ...</div>

    const grouped = groupByMonthAndDate(transactionsList);
    
    const removeCreditDebitSign = (transactionValue: string) => {
        return transactionValue.slice(1);
    }
    const getTimeFromDateString = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    }

    return (
        <div className=" font-custom">
            {Object.entries(grouped)
                .sort((a, b) => b[1].monthDate.getTime() - a[1].monthDate.getTime())
                .map(([monthKey, { totalDebit, monthDate, dates }]) => (
                    <div className="border-b-2" key={monthKey}>
                        <div className="flex justify-between items-center px-4 py-4">
                        <p className="text-lg text-primary">
                            {monthKey} 
                        </p>
                        <span className="">${totalDebit.toFixed(2)}</span>
                        </div>

                        {Object.entries(dates)
                            .sort((a, b) => b[1].date.getTime() - a[1].date.getTime())
                            .map(([dateKey, { transactions, total, isCredit }]) => (
                                <div key={dateKey} className="border-none">
                                    <div className="flex justify-between items-center border-none bg-highlight px-4 py-2">
                                        <p className="text-xs text-secondary">{dateKey}</p>
                                        {/* <span className={`font-semibold ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                                            {isCredit ? `` : `${Math.abs(total).toFixed(2)}`}
                                        </span> */}
                                    </div>
                                    <table className="w-full bg-white font-custom table-auto border-collapse">
                                        <thead className="bg-highlight">
                                        </thead>
                                        <tbody>
                                            {transactions.map((item, index) => {
                                                const isLastRow = index === transactions.length - 1;
                                                const amount = parseFloat(removeCreditDebitSign(item.attributes.amount.value)).toFixed(2);
                                                const amountFormatted = `${item.attributes.amount.value.startsWith('+') ? "+" : ""}$${amount}`;
                                                const amountColor = item.attributes.amount.value.startsWith('+') ? "text-tertiary" : "text-primary";

                                                return (
                                                    <tr key={item.id} className="hover:bg-highlight">
                                                        <td className="text-primary border-none">
                                                        <div className="text-primary flex items-center justify-center h-full w-full">
                                                            {getCategoryIcon(item.relationships.tags.data[0].id)}
                                                        </div>    
                                                        </td>
                                                        <td className={`px-4 py-2 ${isLastRow ? 'border-none' : 'border-b'}`}>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-primary">{item.attributes.description}<br />
                                                                    <span className="text-xs text-secondary">{getTimeFromDateString(item.attributes.createdAt)}</span>
                                                                    {item.attributes.message ? <span className="text-xs text-secondary">, {item.attributes.message}</span> : <span className='text-gray-400'>, {item.attributes.performingCustomer.displayName}</span>}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className={`px-4 py-2 text-right ${amountColor} ${isLastRow ? 'border-none' : 'border-b'}`}>
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
