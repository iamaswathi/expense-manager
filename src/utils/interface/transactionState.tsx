import { Account, Category, Transaction } from "./transactionInterface";


export interface TransactionsState {
    accounts: Account[];
    categories: Category[];
    selectedAccountIds: string[];
    selectedCategoryId: string | null;
    transactionsList: Transaction[];
    selectedTransactionId: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}


