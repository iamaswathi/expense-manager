import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { clearSelectedTransaction } from "../../state/transactions/transactionsSlice";
import { getCategoryIcon } from "../../utils/getCategoryIcons";
import { findIfCredit, getDateDay, getTimeFromDateString, removeCreditDebitSign } from "../../utils/utilities";

const TransactionDetail = () => {
    const { transactionsList, selectedTransactionId } = useSelector((state: RootState) => state.transctions);
    const transaction = transactionsList.find(tx => tx.id === selectedTransactionId);
    const dispatch = useDispatch();


    if (!transaction) {
        return null;
    }

    const {
        description,
        message,
        createdAt,
        amount,
        transactionType,
    } = transaction.attributes;
    const txnAmount = parseFloat(removeCreditDebitSign(amount.value)).toFixed(2);
    const amountFormatted = `${amount.value.startsWith('+') ? "+" : ""}$${txnAmount}`;
    const isCredit = findIfCredit(transaction.attributes.amount.value);
    const amountColor = isCredit ? "text-tertiary" : "text-primary";
        

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white border rounded shadow-md px-2 py-2 w-80 relative font-sans">
                <button
                    className="absolute top-1 right-2 text-gray-500 text-lg"
                    onClick={() => dispatch(clearSelectedTransaction())}
                >
                    ×
                </button>

                <div className="border-b px-4 pt-4 pb-2 flex justify-between">
                    <div>{getCategoryIcon(transaction.relationships.tags.data[0].id)}</div>
                    <div>
                        <div className="font-semibold text-sm">{description || 'Merchant Name'}</div>
                        <div className="text-xs">{message || 'Description or note'}</div>
                    </div>
                    <div className={`text-sm font-bold ${amountColor} `}>{amountFormatted}</div>
                </div>

                <table className="w-full text-sm">
                    <tbody>
                        <tr className="border-none">
                            <td className="px-4 py-2 text-left text-gray-600">{isCredit ? 'Received': 'Paid'}</td>
                            <td className="px-4 py-2 text-right">

                                {getDateDay(createdAt)} {getTimeFromDateString(createdAt)}
                            </td>
                        </tr>
                        <tr className="border-none">
                            <td className="px-4 py-2 text-left text-gray-600">Payment method</td>
                            <td className="px-4 py-2 text-right">Direct credit</td>
                        </tr>
                        <tr className="border-b">
                            <td className="px-4 py-2 text-left text-gray-600">Payment ID</td>
                            <td className="px-4 py-2 text-right">sbjdhfkjshkjfh</td>
                        </tr>

                        {/* Add Category */}
                        <tr className="border-b cursor-pointer hover:bg-gray-50">
                            <td className="px-4 py-2 text-blue-500 font-medium flex items-center">
                                <span className="mr-2">+</span> ADD category
                            </td>
                            <td className="px-4 py-2 text-right text-gray-500">&gt;</td>
                        </tr>

                        {/* Add Tag */}
                        <tr className="cursor-pointer hover:bg-gray-50">
                            <td className="px-4 py-2 text-blue-500 font-medium flex items-center">
                                <span className="mr-2">+</span> ADD Tag
                            </td>
                            <td className="px-4 py-2 text-right text-gray-500">&gt;</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )

};

export default TransactionDetail;

