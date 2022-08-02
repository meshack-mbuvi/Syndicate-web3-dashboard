import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GasDetails, initialState } from './types';

const gasDetailsSlice = createSlice({
  name: 'gasDetails',
  initialState,
  reducers: {
    setGasDetails(state, action: PayloadAction<GasDetails>) {
      state.gasDetails = action.payload;
    }
  }
});

export const { setGasDetails } = gasDetailsSlice.actions;

export default gasDetailsSlice.reducer;
