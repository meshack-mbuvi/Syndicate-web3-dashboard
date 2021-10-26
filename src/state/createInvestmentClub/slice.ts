import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./types";

const createInvestmentClubSlice = createSlice({
  name: "createInvestmentClub",
  initialState,
  reducers: {
    setInvestmentClubName(state, action: PayloadAction<string>) {
      state.investmentClubName = action.payload;
    },
    setInvestmentClubSymbol(state, action: PayloadAction<string>) {
      state.investmentClubSymbol = action.payload;
    },
    setMembersCount(state, action: PayloadAction<number>) {
      state.membersCount = action.payload;
    },
  },
});

export const {
  setInvestmentClubName,
  setInvestmentClubSymbol,
  setMembersCount,
} = createInvestmentClubSlice.actions;
export default createInvestmentClubSlice.reducer;
