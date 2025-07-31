import { useEffect, useMemo, useState } from 'react';
import { getCategoryIcon } from '../../utils/getCategoryIcons';
import { groupByMonthAndDate } from '../../utils/groupByMonthAndDate';
import { useAppSelector, useAppDispatch } from '../../state/hooks';
import { loadAccounts, loadCategories, loadTransactions, setSelectedAccounts, setSelectedTransaction, setTransactions } from '../../state/transactions/transactionsSlice';
import { RootState } from '../../state/store';
import TransactionDetail from '../TransactionDetail/TransactionDetail';
import { getTimeFromDateString, transformTransactions } from '../../utils/utilities';
import AccountsList from '../AccountsList/AccountsList';
import { FinancialDashboard } from '../FinancialDashboard/FinancialDashboard';

export default function TransactionsList() {

    const dispatch = useAppDispatch();
    const { transactionsList, accounts, categories, selectedAccountIds, status } = useAppSelector((state: RootState) => state.transctions);
    console.log('Categories in state:', categories);
    console.log('Accounts in state:', accounts);
    useEffect(() => {
        const loadData = async () => {
            await dispatch(loadAccounts());
            await dispatch(loadCategories());
            await dispatch(loadTransactions());
        };
        loadData();
        console.log('Selected category changed:', selectedCategory);
    }, [dispatch]);

    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const displayTransactions = useMemo(() => {
        return transactionsList.map(t => {
            const transactionTag = t.relationships.tags?.data[0]?.id;
            const category = categories.find(c =>
                c.name.toLowerCase() === transactionTag?.toLowerCase()
            );

            return {
                ...transformTransactions(t, accounts),
                categoryId: category?.id || 'uncategorized',
                categoryName: category?.name || transactionTag || 'Uncategorized'
            };
        });
    }, [transactionsList, accounts, categories]);

    const filteredTransactions = useMemo(() => {
        return displayTransactions
            .filter(t => selectedAccountIds.length === 0 ||
                selectedAccountIds.includes(t.accountId))
            .filter(t => {
                return selectedCategory === 'All' ||
                    t.categoryName.toLowerCase() === selectedCategory.toLowerCase();
            });
    }, [displayTransactions, selectedAccountIds, selectedCategory]);

    // Category selection handler
    const handleSelectCategory = (category: string) => {
        console.log('Selecting category:', category); // Debug log
        setSelectedCategory(category);
    };

    if (status === 'loading') return <div className="p-4 max-w-4xl mx-auto font-custom">Loading ...</div>

    const grouped = groupByMonthAndDate(filteredTransactions);

    return (
        <div className="p-4 max-w-4xl mx-auto font-custom">
            <FinancialDashboard transactions={filteredTransactions} />
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                    onClick={() => handleSelectCategory('All')}
                    className={`px-3 py-1 rounded-full ${selectedCategory === 'All'
                        ? 'border-selected text-selected'
                        : 'bg-gray-100'
                        }`}
                >
                    All
                </button>
                {categories?.map(category => ( // Add optional chaining
                    <button
                        key={category.id}
                        onClick={() => handleSelectCategory(category.name)}
                        className={`px-3 py-1 rounded-full flex items-center ${selectedCategory === category.name
                            ? 'border-selected text-selected'
                            : 'bg-gray-100'
                            }`}
                    >
                        <span className="mr-1">{getCategoryIcon(category.name)}</span>
                        <span className="${selectedCategory === category.name
                            ? 'text-selected'
                            : 'text-primary'">{category.name}</span>
                    </button>
                ))}
            </div>
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
                            .map(([dateKey, { transactions, total, }]) => (
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
                                                const amountColor = (item.type.toLowerCase() === 'credit') ? "text-tertiary" : "text-primary";
                                                const amountFormatted = `${(item.type.toLowerCase() === 'credit')  ? "+" : ""}$${item.amount}`;

                                                return (
                                                    <tr key={item.id} className="hover:bg-hightlight" onClick={() => dispatch(setSelectedTransaction(item.id))}>
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
