import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './types';

const modifyClubSettingsSlice = createSlice({
  name: 'modifyClubSettings',
  initialState,
  reducers: {
    setExistingIsOpenToDeposits(state, action: PayloadAction<boolean>) {
      state.existingIsOpenToDeposits = action.payload;
    },
    setExistingOpenToDepositsUntil(state, action: PayloadAction<Date>) {
      state.existingOpenToDepositsUntil = action.payload;
    },
    setExistingAmountRaised(state, action: PayloadAction<number>) {
      state.existingAmountRaised = action.payload;
    },
    setExistingMaxAmountRaising(state, action: PayloadAction<string>) {
      state.existingMaxAmountRaising = action.payload;
    },
    setExistingMaxNumberOfMembers(state, action: PayloadAction<number>) {
      state.existingMaxNumberOfMembers = action.payload;
    },
    setExistingNumberOfMembers(state, action: PayloadAction<number>) {
      state.existingNumberOfMembers = action.payload;
    },
    setMaxNumberOfMembers(state, action: PayloadAction<number>) {
      state.maxNumberOfMembers = action.payload;
    },
    setMaxAmountRaising(state, action: PayloadAction<string>) {
      state.maxAmountRaising = action.payload;
    },
    setOpenToDepositsUntil(state, action: PayloadAction<Date>) {
      state.openToDepositsUntil = action.payload;
    }
  }
});

export const {
  setExistingIsOpenToDeposits,
  setExistingOpenToDepositsUntil,
  setExistingAmountRaised,
  setExistingMaxAmountRaising,
  setExistingMaxNumberOfMembers,
  setExistingNumberOfMembers,
  setMaxNumberOfMembers,
  setMaxAmountRaising,
  setOpenToDepositsUntil
} = modifyClubSettingsSlice.actions;
export default modifyClubSettingsSlice.reducer;
