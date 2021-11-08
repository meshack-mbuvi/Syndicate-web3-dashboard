import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clubERC20, initialState } from "./types";

const setClubERC20sSlice = createSlice({
  name: "clubERC20",
  initialState,
  reducers: {
    setClubERC20s(state, action: PayloadAction<clubERC20[]>) {
      state.clubERC20s = action.payload;
    },
  },
});

export const { setClubERC20s } = setClubERC20sSlice.actions;

export default setClubERC20sSlice.reducer;
