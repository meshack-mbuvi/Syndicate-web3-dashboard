import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TokenClaimed, initialState } from "./types";

const setTokenClaimedSlice = createSlice({
  name: "tokenClaimed",
  initialState,
  reducers: {
    setTokenClaimed(state, action: PayloadAction<TokenClaimed>) {
      const claimed = action.payload;
      state.isTokenClaimed = claimed;
    },
    setLoadingTokenClaimed(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    clearTokenClaimed(state, action: PayloadAction<boolean>) {
      state.isTokenClaimed = initialState.isTokenClaimed;
    },
  },
});

export const { setTokenClaimed, setLoadingTokenClaimed, clearTokenClaimed } =
  setTokenClaimedSlice.actions;

export default setTokenClaimedSlice.reducer;
