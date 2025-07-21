import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { setSelectedAccounts, loadTransactions } from "../../state/transactions/transactionsSlice";
import { transformAccounts } from "../../utils/utilities";

export default function AccountsList() {
    const dispatch = useAppDispatch();
    const { accounts: rawAccounts, selectedAccountIds } = useAppSelector((state) => state.transctions);
    const [isOpen, setIsOpen] = useState(false);

    const accounts = transformAccounts(rawAccounts);
    const handleAccountSelect = (accountId: string) => {
        const newSelection = selectedAccountIds.includes(accountId)
            ? selectedAccountIds.filter(id => id !== accountId)
            : [...selectedAccountIds, accountId];
        dispatch(setSelectedAccounts(newSelection));
        dispatch(loadTransactions(newSelection));
    };

    return (
        <div className="font-custom relative w-48">
            <button onClick={() => setIsOpen(!isOpen)}
                className="p-2 border rounded flex items-center justify-between w-full">
                {selectedAccountIds.length > 0 ? `${selectedAccountIds.length} selected` : 'Select Accounts'}
                <span>{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen &&
                <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg">
                    {accounts.map((account) => (
                        <div key={account.id} onClick={() => handleAccountSelect(account.id)}
                            className={`p-2 hover:bg-gray-100 cursor-pointer ${selectedAccountIds.includes(account.id) ? 'bg-blue-50' : ''}`}>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedAccountIds.includes(account.id)}
                                    readOnly
                                    className="mr-2"
                                />
                                <div>
                                    <p className="text-primary flex">
                                        <span className="px-4"><img className="logo-style" src={account.bankLogo} alt={account.bankAltText} /></span>
                                        <span> {account.name}</span>
                                    </p>
                                    <p className="text-sm text-gray-500">.....{account.last4digits}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            }
        </div>
    );
}