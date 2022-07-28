import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ICollectiveDetails, initialState } from './types';

export const collectiveDetails = createSlice({
  name: 'collectiveDetails',
  initialState,
  reducers: {
    setCollectiveDetails(state, action: PayloadAction<ICollectiveDetails>) {
      state.details = action.payload;
      state.settings.isTransferable = action.payload.isTransferable;
      state.settings.isOpen = action.payload.isOpen;
    },
    setDescription(state, action: PayloadAction<string>) {
      state.details.description = action.payload;
    },
    setMintPrice(state, action: PayloadAction<string>) {
      state.details.mintPrice = action.payload;
    },
    setMaxPerWallet(state, action: PayloadAction<string>) {
      state.details.maxPerWallet = action.payload;
    },
    setIsTransferable(state) {
      state.settings.isTransferable = !state.settings.isTransferable;
    },
    setIsCollectiveOpen(state) {
      state.settings.isOpen = !state.settings.isOpen;
    }
  }
});

export const {
  setCollectiveDetails,
  setDescription,
  setMintPrice,
  setMaxPerWallet,
  setIsTransferable,
  setIsCollectiveOpen
} = collectiveDetails.actions;

export default collectiveDetails.reducer;
