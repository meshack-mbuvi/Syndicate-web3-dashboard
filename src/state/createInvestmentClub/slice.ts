import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState, mintEndTime } from "./types";

const createInvestmentClubSlice = createSlice({
  name: "createInvestmentClub",
  initialState,
  reducers: {
    setInvestmentClubName(state, action: PayloadAction<string>) {
      state.investmentClubName = action.payload;
    },
    setInvestmentClubSymbolPlaceHolder(state, action: PayloadAction<string>) {
      state.investmentClubSymbolPlaceHolder = action.payload;
      state.investmentClubSymbol = `${action.payload}`;
    },
    setMembersCount(state, action: PayloadAction<string>) {
      state.membersCount = action.payload;
    },
    setTokenCap(state, action: PayloadAction<string>) {
      state.tokenCap = action.payload;
    },
    setMintEndTime(state, action: PayloadAction<mintEndTime>) {
      state.mintEndTime = action.payload;
    },
    setTransactionHash(state, action: PayloadAction<string>) {
      state.clubCreationStatus.transactionHash = action.payload;
    },
    setClubCreationReceipt(state, action) {
      state.clubCreationStatus.creationReceipt = action.payload;
    },
  },
});

export const {
  setInvestmentClubName,
  setInvestmentClubSymbolPlaceHolder,
  setMembersCount,
  setTokenCap,
  setMintEndTime,
  setTransactionHash,
  setClubCreationReceipt,
} = createInvestmentClubSlice.actions;
export default createInvestmentClubSlice.reducer;
