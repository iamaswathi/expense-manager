import { useAppSelector, useAppDispatch } from '../../state/hooks';
import { getCategoryIcon } from '../../utils/getCategoryIcons';
import { getFullDate, getTimeFromDateString, transformTransactions } from '../../utils/utilities';
import { clearSelectedTransaction } from '../../state/transactions/transactionsSlice';

export default function TransactionDetail() {
    const dispatch = useAppDispatch();
    const { selectedTransactionId, transactionsList, accounts, categories } = useAppSelector((state) => state.transctions);
    const selectedTransaction = transactionsList.find((tx: { id: string; }) => tx.id === selectedTransactionId);
    const transaction = selectedTransaction
        ? transformTransactions(selectedTransaction, accounts)
        : null;

    if (!transaction) return null;

    const categoryName = categories.find((c: { name: string; }) =>
        c.name.toLowerCase() === transaction.category.toLowerCase()
    )?.name || transaction.category;

    const getAccountDetails = () => {
        const acc = accounts.find((a: { id: string; }) => a.id === transaction.accountId);
        return acc?.name + ' - ' + acc?.last4digits;
    }

    const amountColor = transaction.type.toLowerCase() === 'credit'
        ? 'text-tertiary'
        : 'text-primary';
    const amountFormatted = `${transaction.type.toLowerCase() === 'credit' ? '+' : ''}$${transaction.amount.toFixed(2)}`;

    const handleClose = () => {
        dispatch(clearSelectedTransaction());
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-gray-100">
                            {getCategoryIcon(categoryName)}
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-primary">
                                {transaction.description}
                            </h2>
                            <p className="text-sm text-secondary">
                                {getTimeFromDateString(transaction.date)}
                                {/* {transaction.message && ` • ${transaction.message}`} */}
                            </p>
                        </div>
                    </div>
                    <span className={`text-lg font-medium ${amountColor}`}>
                        {amountFormatted}
                    </span>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-sm text-secondary">Account</span>
                        <div className="flex items-center gap-2">
                            <img
                                className="w-6 h-6"
                                src={transaction.bankLogo}
                                alt={transaction.bankAltText}
                            />
                            <span className="text-sm text-primary">{getAccountDetails()}</span>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-sm text-secondary">Category</span>
                        <span className="text-sm text-primary">
                            {categoryName}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-sm text-secondary">Date</span>
                        <span className="text-sm text-primary">
                            {getFullDate(transaction.date)}
                        </span>
                    </div>

                    {transaction.status && (
                        <div className="flex justify-between">
                            <span className="text-sm text-secondary">Status</span>
                            <span className="text-sm text-primary">
                                {transaction.status}
                            </span>
                        </div>
                    )}

                    {transaction.biller && (
                        <div className="flex justify-between">
                            <span className="text-sm text-secondary">Biller</span>
                            <span className="text-sm text-primary">
                                {transaction.biller}
                            </span>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        className="px-4 py-2 bg-primary rounded-md text-sm text-white"
                        onClick={handleClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}