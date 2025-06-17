import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TransactionsState } from "../../utils/interface/transactionState";
import { fetchTransactionsList } from "../../services/dataService";
import { Transaction } from "../../utils/interface/transactionInterface";

const initialState: TransactionsState = {
    transactionsList: [],
    selectedTransactionId: null,
    status: 'idle',
    error: null,
}

export const loadTransactions = createAsyncThunk(
    'transactions/loadTransactions',
    async () => {
      const data = await fetchTransactionsList();
      return data;
    }
  );

const transactionSlice = createSlice({
    name: 'transactionsList',
    initialState,
    reducers: {
        setTransactions(state, action: PayloadAction<Transaction[]>) {
            state.transactionsList = action.payload;
        },
        setSelectedTransaction(state, action: PayloadAction<string>) {
            state.selectedTransactionId = action.payload;
        },
        clearSelectedTransaction(state) {
            state.selectedTransactionId = null;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(loadTransactions.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(loadTransactions.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.transactionsList = action.payload;
        })
        .addCase(loadTransactions.rejected, (state) => {
            state.status = 'failed';
        });
    }
});

export const {setTransactions, setSelectedTransaction, clearSelectedTransaction} = transactionSlice.actions;
export default transactionSlice.reducer;