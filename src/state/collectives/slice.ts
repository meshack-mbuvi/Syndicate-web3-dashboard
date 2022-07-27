import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Collective, initialState } from './types';

const collectivesSlice = createSlice({
  name: 'collectives',
  initialState,
  reducers: {
    setAdminCollectives(state, action: PayloadAction<Collective[]>) {
      state.adminCollectives = action.payload;
    },
    setMemberCollectives(state, action: PayloadAction<Collective[]>) {
      state.memberCollectives = action.payload;
    }
  }
});

export const { setAdminCollectives, setMemberCollectives } =
  collectivesSlice.actions;

export default collectivesSlice.reducer;
