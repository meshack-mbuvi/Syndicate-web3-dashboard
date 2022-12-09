import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState, CurrentTransaction } from './types';

const setTransactionsSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setCurrentTransaction(state, action: PayloadAction<CurrentTransaction>) {
      state.currentTransaction = action.payload;
    }
  }
});

export const { setCurrentTransaction } = setTransactionsSlice.actions;

export default setTransactionsSlice.reducer;
