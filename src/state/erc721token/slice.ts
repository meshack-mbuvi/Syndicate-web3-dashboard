import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ERC721Token, initialState } from "./types";

const erc721TokenSlice = createSlice({
  name: "erc721token",
  initialState,
  reducers: {
    setERC721TokenDetails(state, action: PayloadAction<ERC721Token>) {
      const erc721Token = action.payload;
      state.erc721Token = erc721Token;
    },
    setERC721TokenContract(state, action: PayloadAction<any>) {
      state.erc721TokenContract = action.payload;
    },
    setERC721Loading(state, action: PayloadAction<boolean>) {
      state.erc721Token.loading = action.payload;
    },
    clearERC721TokenDetails(state) {
      state.erc721Token = initialState.erc721Token;
    },
  },
});

export const {
  setERC721TokenDetails,
  setERC721TokenContract,
  setERC721Loading,
  clearERC721TokenDetails,
} = erc721TokenSlice.actions;

export default erc721TokenSlice.reducer;
