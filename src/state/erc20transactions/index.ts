import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Transaction,
  initialState,
  CurrentTransaction,
  emptyCurrentTransaction
} from './types';

const setTransactionsSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setMyTransactions(
      state,
      action: PayloadAction<{ txns: Transaction[]; skip: number }>
    ) {
      const { txns, skip } = action.payload;
      state.myTransactions[skip] = txns;
    },
    setInvestmentTransactions(
      state,
      action: PayloadAction<{ txns: Transaction[]; skip: number }>
    ) {
      const { txns, skip } = action.payload;
      state.investmentTransactions[skip] = txns;
    },
    setLoadingTransactions(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    clearMyTransactions(state, action: PayloadAction<boolean>) {
      state.myTransactions = {};
    },
    setCurrentTransaction(state, action: PayloadAction<CurrentTransaction>) {
      state.currentTransaction = action.payload;
    },
    clearCurrentTransaction(state) {
      state.currentTransaction = emptyCurrentTransaction;
    },
    setTotalTransactionsCount(state, action: PayloadAction<number>) {
      state.totalTransactionsCount = action.payload;
    },
    setTotalInvestmentTransactionsCount(state, action: PayloadAction<number>) {
      state.totalInvestmentTransactionsCount = action.payload;
    }
  }
});

export const {
  setMyTransactions,
  setLoadingTransactions,
  clearMyTransactions,
  setCurrentTransaction,
  clearCurrentTransaction,
  setTotalTransactionsCount,
  setInvestmentTransactions,
  setTotalInvestmentTransactionsCount
} = setTransactionsSlice.actions;

export default setTransactionsSlice.reducer;
