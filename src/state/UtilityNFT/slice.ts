import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UtilityNFT, initialState } from './types';

const utilityNFTSlice = createSlice({
  name: 'utilityNFT',
  initialState,
  reducers: {
    setUtilityNFT(state, action: PayloadAction<UtilityNFT>) {
      const utilityNFT = action.payload;
      state.utilityNFT = utilityNFT;
      //   if (utilityNFT.account !== state.utilityNFT?.account) {
      //     state.utilityNFT = utilityNFT;
      //   }
    },
    setMembershipPasses(state, action: PayloadAction<any>) {
      state.utilityNFT.membershipPasses = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    clearUtilityNFT(state) {
      state.utilityNFT = initialState.utilityNFT;
    }
  }
});

export const {
  setUtilityNFT,
  setMembershipPasses,
  setLoading,
  clearUtilityNFT
} = utilityNFTSlice.actions;

export default utilityNFTSlice.reducer;
