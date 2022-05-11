import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { connectedMember, initialState } from './types';

const connectClubMemberSlice = createSlice({
  name: 'connected member',
  initialState,
  reducers: {
    setConnectedMember(state, action: PayloadAction<connectedMember>) {
      state.connectedMember = action.payload;
    }
  }
});

export const { setConnectedMember } = connectClubMemberSlice.actions;

export default connectClubMemberSlice.reducer;
