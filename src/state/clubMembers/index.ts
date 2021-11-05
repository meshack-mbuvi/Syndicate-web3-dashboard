import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState, clubMember } from "./types"

const clubMembersSlice = createSlice({
  name: "club members",
  initialState,
  reducers: {
    setClubMembers(state, action: PayloadAction<clubMember[]>) {
      state.clubMembers = action.payload;
    },
  },
});

export const { setClubMembers } = clubMembersSlice.actions;
export default clubMembersSlice.reducer;
