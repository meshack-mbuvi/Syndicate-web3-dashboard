import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { clubERC20, initialState } from './types';

const setClubERC20sSlice = createSlice({
  name: 'clubERC20',
  initialState,
  reducers: {
    setOtherClubERC20s(state, action: PayloadAction<clubERC20[]>) {
      // @ts-expect-error TS(2322): Type 'clubERC20[]' is not assignable to type 'neve... Remove this comment to see the full error message
      state.otherClubERC20s = action.payload;
    },
    setMyClubERC20s(state, action: PayloadAction<clubERC20[]>) {
      // @ts-expect-error TS(2322): Type 'clubERC20[]' is not assignable to type 'neve... Remove this comment to see the full error message
      state.myClubERC20s = action.payload;
    },
    setLoadingClubERC20s(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    }
  }
});

export const { setOtherClubERC20s, setMyClubERC20s, setLoadingClubERC20s } =
  setClubERC20sSlice.actions;

export default setClubERC20sSlice.reducer;
