import { useEffect, useState } from 'react';
import { getCategoryIcon } from '../../utils/getCategoryIcons';
import { groupByMonthAndDate } from '../../utils/groupByMonthAndDate';
import { useAppSelector, useAppDispatch } from '../../state/hooks';
import { loadAccounts, loadTransactions, setSelectedAccounts, setSelectedTransaction, setTransactions } from '../../state/transactions/transactionsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../state/store';
import { fetchTransactionsList } from '../../services/dataService';
import TransactionDetail from '../TransactionDetail/TransactionDetail';
import { findIfCredit, getTimeFromDateString, removeCreditDebitSign, transformTransactions } from '../../utils/utilities';
import AccountsList from '../AccountsList/AccountsList';

export default function TransactionsList() {

    const dispatch = useAppDispatch();
    const transactions = useAppSelector((state: RootState) => state.transctions.transactionsList);
    const accounts = useAppSelector((state: RootState) => state.transctions.accounts);
    const selectedAccountIds = useAppSelector((state: RootState) => state.transctions.selectedAccountIds);
    const status = useAppSelector((state) => state.transctions.status);

    useEffect(() => {
        const loadData = async () => {
            await dispatch(loadAccounts());
            await dispatch(loadTransactions());
        };
        loadData();
    }, [dispatch]);

    const displayTransactions = transactions.map(t => transformTransactions(t, accounts));

    if (status === 'loading') return <div>Loading ...</div>

    const grouped = groupByMonthAndDate(displayTransactions);

    return (
        <div className="font-custom">
            <AccountsList />

            {/* Display selected account badges */}
            {selectedAccountIds.length > 0 && (
                <div className="flex flex-wrap gap-2 px-4 py-2">
                    {selectedAccountIds.map(id => {
                        const account = accounts.find(a => a.id === id);
                        return account ? (
                            <span key={id}>
                                <img className="logo-style"
                                    src={account.bankLogo}
                                    alt={account.bankAltText} />
                            </span>
                        ) : null;
                    })}
                </div>
            )}

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
                                                const amount = parseFloat(removeCreditDebitSign(item.amount)).toFixed(2);
                                                const isCredit = findIfCredit(item.amount);
                                                const amountColor = isCredit ? "text-tertiary" : "text-primary";
                                                const amountFormatted = `${isCredit ? "+" : ""}$${amount}`;

                                                return (
                                                    <tr key={item.id} className="hover:bg-highlight" onClick={() => dispatch(setSelectedTransaction(item.id))}>
                                                        <td className="text-primary border-none">
                                                            <div className="text-primary flex items-center justify-center h-full w-full">
                                                                <img className="logo-style" src={item.bankLogo} alt={item.bankAltText} />
                                                            </div>
                                                        </td>
                                                        <td className={`px-4 py-2 ${isLastRow ? 'border-none' : 'border-b'}`}>
                                                            <div className="flex items-center gap-2">
                                                                <span className=''>{getCategoryIcon(item.category)}</span>
                                                                <span className="text-primary">{item.description}<br />
                                                                    <span className="text-xs text-secondary">{getTimeFromDateString(item.date)}</span>
                                                                    {item.message ? <span className="text-xs text-secondary">, {item.message}</span> : <span className='text-gray-400'>, {item.biller}</span>}
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
