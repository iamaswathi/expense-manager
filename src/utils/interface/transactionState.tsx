import { Account, Transaction } from "./transactionInterface";


export interface TransactionsState {
    accounts: Account[];
    selectedAccountIds: string[];
    transactionsList: Transaction[];
    selectedTransactionId: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}


