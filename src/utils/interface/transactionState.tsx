import { Transaction } from "./transactionInterface";


export interface TransactionsState {
    transactionsList: Transaction[];
    selectedTransactionId: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}


