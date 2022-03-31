import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAirdropInfo, initialState } from './types';

const setAirdropInfoSlice = createSlice({
  name: 'AirdropInfo',
  initialState,
  reducers: {
    setAirdropInfo(state, action: PayloadAction<IAirdropInfo>) {
      const claimed = action.payload;
      state.airdropInfo = claimed;
    },
    setLoadingAirdropInfo(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    clearAirdropInfo(state, action: PayloadAction<boolean>) {
      state.airdropInfo = initialState.airdropInfo;
    }
  }
});

export const { setAirdropInfo, setLoadingAirdropInfo, clearAirdropInfo } =
  setAirdropInfoSlice.actions;

export default setAirdropInfoSlice.reducer;
