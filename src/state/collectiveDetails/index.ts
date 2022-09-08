import { OpenUntil } from '@/components/collectives/create/inputs/openUntil/radio';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  ICollectiveDetails,
  initialState,
  EditRowIndex,
  ICollectiveLoadingState,
  Event
} from './types';

export const collectiveDetails = createSlice({
  name: 'collectiveDetails',
  initialState,
  reducers: {
    setCollectiveDetails(state, action: PayloadAction<ICollectiveDetails>) {
      state.details = action.payload;
      state.settings.isTransferable = action.payload.isTransferable;
      state.settings.isOpen = action.payload.isOpen;
      state.settings.mintPrice = action.payload.mintPrice;
      state.settings.maxPerWallet = action.payload.maxPerWallet;
      state.settings.mintEndTime = action.payload.mintEndTime;
      state.settings.maxSupply = action.payload.maxSupply;
    },
    setCollectiveNameAndAddress(state, action: PayloadAction<any>) {
      state.details.collectiveName = action.payload.collectiveName;
      state.details.collectiveAddress = action.payload.collectiveAddress;
    },
    setMetadataCid(state, action: PayloadAction<string>) {
      state.details.metadataCid = action.payload;
    },
    setDescription(state, action: PayloadAction<string>) {
      state.details.description = action.payload;
    },
    setMintPrice(state, action: PayloadAction<string>) {
      state.settings.mintPrice = action.payload;
    },
    setMintEndTime(state, action: PayloadAction<string>) {
      state.details.mintEndTime = action.payload;
    },
    setMaxSupply(state, action: PayloadAction<number>) {
      state.details.maxSupply = action.payload;
    },
    setMaxPerWallet(state, action: PayloadAction<string>) {
      state.settings.maxPerWallet = action.payload;
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
    },
    setCollectiveLoadingState(
      state,
      action: PayloadAction<ICollectiveLoadingState>
    ) {
      state.loadingState = action.payload;
    },
    setMemberJoinedEvents(state, action: PayloadAction<Event[]>) {
      state.events.memberJoined = action.payload;
    },
    setLoadingMemberJoinedEvents(state, action: PayloadAction<boolean>) {
      state.events.loadingEvents = action.payload;
    }
  }
});

export const {
  setCollectiveDetails,
  setCollectiveNameAndAddress,
  setMetadataCid,
  setDescription,
  setMintPrice,
  setMintEndTime,
  setMaxSupply,
  setMaxPerWallet,
  setIsTransferable,
  setIsCollectiveOpen,
  setUpdateEnded,
  setOpenUntil,
  setActiveRowIdx,
  setCollectiveLoadingState,
  setMemberJoinedEvents,
  setLoadingMemberJoinedEvents
} = collectiveDetails.actions;

export default collectiveDetails.reducer;
