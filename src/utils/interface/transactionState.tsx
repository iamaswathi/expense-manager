import { Transaction } from "./transactionInterface";


export interface TransactionsState {
    transactionsList: Transaction[];
    selectedTransaction: Transaction | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}


