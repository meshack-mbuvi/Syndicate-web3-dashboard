import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ERC20Token, initialState } from "./types";

const erc20TokenSlice = createSlice({
  name: "erc20token",
  initialState,
  reducers: {
    setERC20TokenDetails(state, action: PayloadAction<ERC20Token>) {
      state.erc20Token = action.payload;
    },
    setERC20TokenContract(state, action: PayloadAction<any>) {
      state.erc20TokenContract = action.payload;
    },
    setLoading(state, action) {
      state.erc20Token.loading = action.payload;
    },
    setMemberPercentShare(state, action) {
      state.erc20Token.memberPercentShare = action.payload;
    },
    setAccountClubTokens(state, action) {
      state.erc20Token.accountClubTokens = action.payload;
    },
  },
});

export const {
  setERC20TokenDetails,
  setERC20TokenContract,
  setLoading,
  setMemberPercentShare,
  setAccountClubTokens,
} = erc20TokenSlice.actions;

export default erc20TokenSlice.reducer;