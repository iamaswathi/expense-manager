import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TransactionsState } from "../../utils/interface/transactionState";
import { fetchTransactionsList } from "../../services/dataService";

const initialState: TransactionsState = {
    transactionsList: [],
    selectedTransaction: null,
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
        // setTransactions(state, action: PayloadAction<Transaction[]>) {
        //     state.transactions = action.payload;
        // },
        selectTransaction(state, action: PayloadAction<string>) {
            const tx = state.transactionsList.find(t=>t.id === action.payload) || null;
            state.selectedTransaction = tx;
        },
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

export const {selectTransaction} = transactionSlice.actions;
export default transactionSlice.reducer;