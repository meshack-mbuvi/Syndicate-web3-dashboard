import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IERC721AirdropInfo, initialState } from './types';

const setERC721AirdropInfoSlice = createSlice({
  name: 'erc721AirdropInfo',
  initialState,
  reducers: {
    setERC721AirdropInfo(state, action: PayloadAction<IERC721AirdropInfo>) {
      const claimed = action.payload;
      state.erc721AirdropInfo = claimed;
    },
    setLoadingERC721AirdropInfo(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    clearERC721AirdropInfo(state, action: PayloadAction<boolean>) {
      state.erc721AirdropInfo = initialState.erc721AirdropInfo;
    }
  }
});

export const {
  setERC721AirdropInfo,
  setLoadingERC721AirdropInfo,
  clearERC721AirdropInfo
} = setERC721AirdropInfoSlice.actions;

export default setERC721AirdropInfoSlice.reducer;
