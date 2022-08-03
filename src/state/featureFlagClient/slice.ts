import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './types';

const featureFlagClientSlice = createSlice({
  name: 'featureFlagClient',
  initialState,
  reducers: {
    setCurrentClient(state, action: PayloadAction<any>) {
      state.featureFlagClient = action.payload;
    }
  }
});

export const { setCurrentClient } = featureFlagClientSlice.actions;

export default featureFlagClientSlice.reducer;
