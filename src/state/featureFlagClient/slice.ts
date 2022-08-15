import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import SplitIO from '@splitsoftware/splitio-react/types/splitio/splitio';
import { initialState } from './types';

const featureFlagClientSlice = createSlice({
  name: 'featureFlagClient',
  initialState,
  reducers: {
    setCurrentClient(state, action: PayloadAction<SplitIO.IBrowserClient>) {
      state.featureFlagClient = action.payload;
    }
  }
});

export const { setCurrentClient } = featureFlagClientSlice.actions;

export default featureFlagClientSlice.reducer;
