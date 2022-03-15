import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState, SelectedMember } from "./types";

const modifyCapTableSlice = createSlice({
  name: "modifyCapTable",
  initialState,
  reducers: {
    setMemberToUpdate(state, action: PayloadAction<SelectedMember>) {
      state.memberToUpdate = action.payload;
    },
  },
});

export const { setMemberToUpdate } = modifyCapTableSlice.actions;

export default modifyCapTableSlice.reducer;
