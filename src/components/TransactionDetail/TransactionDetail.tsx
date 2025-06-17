import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { clearSelectedTransaction } from "../../state/transactions/transactionsSlice";

const TransactionDetail = () => {
    const { transactionsList, selectedTransactionId } = useSelector((state: RootState) => state.transctions);
    const transaction = transactionsList.find(tx => tx.id === selectedTransactionId);
    const dispatch = useDispatch();

    if (!transaction) {
        return null;
    }
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-lg">
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-black"
                    onClick={() => dispatch(clearSelectedTransaction())}
                >
                    ×
                </button>
                <h2 className="text-xl font-bold mb-2">{transaction.attributes.description}</h2>
                <p className="text-gray-700">Amount: {transaction.attributes.amount.value}</p>
                <p className="text-sm text-gray-500">Date: {transaction.attributes.createdAt}</p>
            </div>
        </div>
    );
};

export default TransactionDetail;