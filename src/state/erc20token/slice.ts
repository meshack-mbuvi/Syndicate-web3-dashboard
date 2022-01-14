import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isEqual } from "lodash";
import { ERC20Token, initialState } from "./types";

const erc20TokenSlice = createSlice({
  name: "erc20token",
  initialState,
  reducers: {
    setERC20TokenDetails(state, action: PayloadAction<ERC20Token>) {
      const erc20Token = action.payload;
      if (!isEqual(erc20Token, state.erc20Token)) {
        state.erc20Token = erc20Token;
      }
    },
    setERC20TokenContract(state, action: PayloadAction<any>) {
      state.erc20TokenContract = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.erc20Token.loading = action.payload;
    },
  },
});

export const { setERC20TokenDetails, setERC20TokenContract, setLoading } =
  erc20TokenSlice.actions;

export default erc20TokenSlice.reducer;
