import { OpenUntil } from '@/components/collectives/create/inputs/openUntil/radio';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { initialState, EditRowIndex, ICollectiveSettings } from './types';

// Slice for storing user inputs for modifying collectives
export const modifyCollectiveSettings = createSlice({
  name: 'modifyCollectiveSettings',
  initialState,
  reducers: {
    setCollectiveSettings(state, action: PayloadAction<ICollectiveSettings>) {
      state.settings = action.payload;
    },
    setMetadataCid(state, action: PayloadAction<string>) {
      state.settings.metadataCid = action.payload;
    },
    setMaxSupply(state, action: PayloadAction<number>) {
      state.settings.maxSupply = action.payload;
    },
    setMintPrice(state, action: PayloadAction<string>) {
      state.settings.mintPrice = action.payload;
    },
    setMaxPerWallet(state, action: PayloadAction<string>) {
      state.settings.maxPerWallet = action.payload;
    },
    setMintEndTime(state, action: PayloadAction<string>) {
      state.settings.mintEndTime = action.payload;
    },
    setIsTransferable(state) {
      state.settings.isTransferable = !state.settings.isTransferable;
      state.activeRow = EditRowIndex.Transfer;
    },
    setIsCollectiveOpen(state) {
      state.settings.isOpen = !state.settings.isOpen;
    },
    setUpdateEnded(state, action: PayloadAction<boolean>) {
      state.updateEnded = action.payload;
    },
    setOpenUntil(state, action: PayloadAction<OpenUntil>) {
      state.settings.openUntil = action.payload;
    },
    setActiveRowIdx(state, action: PayloadAction<EditRowIndex>) {
      state.activeRow = action.payload;
    }
  }
});

export const {
  setMetadataCid,
  setCollectiveSettings,
  setMaxSupply,
  setMintEndTime,
  setMintPrice,
  setMaxPerWallet,
  setIsTransferable,
  setIsCollectiveOpen,
  setUpdateEnded,
  setOpenUntil,
  setActiveRowIdx
} = modifyCollectiveSettings.actions;

export default modifyCollectiveSettings.reducer;
