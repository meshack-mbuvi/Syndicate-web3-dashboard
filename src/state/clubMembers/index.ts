import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState, clubMember } from "./types";

const clubMembersSlice = createSlice({
  name: "club members",
  initialState,
  reducers: {
    setClubMembers(state, action: PayloadAction<clubMember[]>) {
      state.clubMembers = action.payload;
    },
    setLoadingClubMembers(state, action: PayloadAction<boolean>) {
      state.loadingClubMembers = action.payload;
    },
  },
});

export const { setClubMembers, setLoadingClubMembers } =
  clubMembersSlice.actions;
export default clubMembersSlice.reducer;
