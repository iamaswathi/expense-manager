import { useEffect } from 'react';
import { getCategoryIcon } from '../../utils/getCategoryIcons';
import { groupByMonthAndDate } from '../../utils/groupByMonthAndDate';
import { useAppSelector } from '../../state/hooks';
import { setSelectedTransaction, setTransactions } from '../../state/transactions/transactionsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../state/store';
import { fetchTransactionsList } from '../../services/dataService';
import TransactionDetail from '../TransactionDetail/TransactionDetail';
import { findIfCredit, getTimeFromDateString, removeCreditDebitSign } from '../../utils/utilities';

export default function TransactionsList() {

    const status = useAppSelector((state) => state.transctions.status);
    const dispatch = useDispatch<AppDispatch>();
    const transactions = useSelector((state: RootState) => state.transctions.transactionsList);

    useEffect(() => {
        fetchTransactionsList().then(data => dispatch(setTransactions(data)));
    }, [dispatch]);

    if (status === 'loading') return <div>Loading ...</div>

    const grouped = groupByMonthAndDate(transactions);

    return (
        <div className="font-custom">
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
                                    </div>
                                    <table className="w-full bg-white font-custom table-auto border-collapse">
                                        <thead className="bg-highlight">
                                        </thead>
                                        <tbody>
                                            {transactions.map((item, index) => {
                                                const isLastRow = index === transactions.length - 1;
                                                const amount = parseFloat(removeCreditDebitSign(item.attributes.amount.value)).toFixed(2);
                                                const isCredit = findIfCredit(item.attributes.amount.value);
                                                const amountColor = isCredit ? "text-tertiary" : "text-primary";
                                                const amountFormatted = `${isCredit ? "+" : ""}$${amount}`;
                                                
                                                return (
                                                    <tr key={item.id} className="hover:bg-highlight" onClick={() => dispatch(setSelectedTransaction(item.id))}>
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
            <TransactionDetail />
        </div>
    );
}
