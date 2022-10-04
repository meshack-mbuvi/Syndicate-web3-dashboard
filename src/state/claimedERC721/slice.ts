import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ERC721laimed, initialState } from './types';

const setClaimedERC721Slice = createSlice({
  name: 'claimedERC721',
  initialState,
  reducers: {
    setERC721Claimed(state, action: PayloadAction<ERC721laimed>) {
      const claimed = action.payload;
      state.erc721Claimed = claimed;
    },
    setLoadingERC721Claimed(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    clearERC721Claimed(state, action: PayloadAction<boolean>) {
      state.erc721Claimed = initialState.erc721Claimed;
    }
  }
});

export const { setERC721Claimed, setLoadingERC721Claimed, clearERC721Claimed } =
  setClaimedERC721Slice.actions;

export default setClaimedERC721Slice.reducer;
