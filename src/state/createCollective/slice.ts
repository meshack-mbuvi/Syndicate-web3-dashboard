import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './types';

const createCollectiveSlice = createSlice({
  name: 'createCollectiveClub',
  initialState,
  reducers: {
    setCollectiveName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setCollectiveSymbol(state, action: PayloadAction<string>) {
      state.symbol = `${action.payload}`;
    },
    setCollectiveArtwork(state, action: PayloadAction<any>) {
      state.artwork = action.payload.artwork;
      state.artworkType = action.payload.artworkType;
      state.artworkUrl = action.payload.artworkUrl;
    },
    setCollectiveDescription(state, action: PayloadAction<string>) {
      state.description = action.payload;
    },
    setCollectivePricePerNFT(state, action: PayloadAction<number>) {
      state.pricePerNFT = action.payload;
    },
    setCollectiveMaxPerWallet(state, action: PayloadAction<number>) {
      state.maxPerWallet = action.payload;
    },
    setCollectiveInvitation(state, action: PayloadAction<boolean>) {
      state.invitation = action.payload;
    },
    setCollectiveOpenUntil(state, action) {
      state.openUntil = action.payload;
    },
    setCollectiveCloseDate(state, action: PayloadAction<string>) {
      state.closeDate = action.payload;
    },
    setCollectiveCloseAfterMaxSupply(state, action: PayloadAction<boolean>) {
      state.closeAfterMaxSupply = action.payload;
    },
    setCollectiveMaxSupply(state, action: PayloadAction<number>) {
      state.maxSupply = action.payload;
    },
    setCollectiveTransferrable(state, action: PayloadAction<boolean>) {
      state.transferrable = action.payload;
    },
    setCollectiveCreationStatus(state, action: PayloadAction<any>) {
      state.creationStatus = action.payload;
    },
    resetCollectiveCreationState(state) {
      state = initialState;
    }
  }
});

export const {
  setCollectiveName,
  setCollectiveSymbol,
  setCollectiveArtwork,
  setCollectiveDescription,
  setCollectivePricePerNFT,
  setCollectiveMaxPerWallet,
  setCollectiveInvitation,
  setCollectiveOpenUntil,
  setCollectiveCloseDate,
  setCollectiveCloseAfterMaxSupply,
  setCollectiveMaxSupply,
  setCollectiveTransferrable,
  setCollectiveCreationStatus,
  resetCollectiveCreationState
} = createCollectiveSlice.actions;
export default createCollectiveSlice.reducer;
