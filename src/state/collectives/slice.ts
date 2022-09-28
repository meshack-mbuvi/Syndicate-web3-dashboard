import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Collective, initialState } from './types';

const collectivesSlice = createSlice({
  name: 'collectives',
  initialState,
  reducers: {
    setAdminCollectives(state, action: PayloadAction<Collective[]>) {
      // @ts-expect-error TS(2322): Type 'Collective[]' is not assignable to type 'nev... Remove this comment to see the full error message
      state.adminCollectives = action.payload;
    },
    setMemberCollectives(state, action: PayloadAction<Collective[]>) {
      // @ts-expect-error TS(2322): Type 'Collective[]' is not assignable to type 'nev... Remove this comment to see the full error message
      state.memberCollectives = action.payload;
    }
  }
});

export const { setAdminCollectives, setMemberCollectives } =
  collectivesSlice.actions;

export default collectivesSlice.reducer;
