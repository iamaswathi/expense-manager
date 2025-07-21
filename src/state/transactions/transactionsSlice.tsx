import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TransactionsState } from "../../utils/interface/transactionState";
import { fetchAccountsList, fetchCategoriesList, fetchTransactionsList } from "../../services/dataService";
import { Account, Transaction } from "../../utils/interface/transactionInterface";
import { RootState } from "../store";
import { transformAccounts } from "../../utils/utilities";

const initialState: TransactionsState = {
    accounts: [],
    categories: [],
    selectedAccountIds: [],
    selectedCategoryId: null,
    transactionsList: [],
    selectedTransactionId: null,
    status: 'idle',
    error: null,
}

export const loadAccounts = createAsyncThunk(
    'transactions/loadAccounts',
    async () => {
        const data = await fetchAccountsList();
        return transformAccounts(data);
    }
);
export const loadCategories = createAsyncThunk(
    'transactions/loadCategories',
    async () => {
        const data = await fetchCategoriesList();
        return data;
    }
);
export const loadTransactions = createAsyncThunk(
    'transactions/loadTransactions',
    async (accountIds?: string[], {getState} = {} as any) => {
        const state = getState?.() as RootState | undefined;
        const ids = accountIds ?? state?.transctions.selectedAccountIds;
        return fetchTransactionsList(ids);
    }
);

const transactionSlice = createSlice({
    name: 'transactionsList',
    initialState,
    reducers: {
        setSelectedAccounts(state, action: PayloadAction<string[]>) {
            state.selectedAccountIds = action.payload;
        },
        setSelectedCategory(state, action: PayloadAction<string>) {
            state.selectedCategoryId = action.payload;
        },
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
            })
            .addCase(loadAccounts.fulfilled, (state, action) => {
                state.accounts = action.payload;
            })
            .addCase(loadCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            });
    }
});

export const { setSelectedAccounts, setSelectedCategory,
    setTransactions, setSelectedTransaction,
    clearSelectedTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;