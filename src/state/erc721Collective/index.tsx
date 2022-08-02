import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ERC721Collective, initialState } from './types';

const erc721CollectiveSlice = createSlice({
  name: 'erc721Collective',
  initialState,
  reducers: {
    setERC721Collective(state, action: PayloadAction<ERC721Collective>) {
      state.erc721Collective = action.payload;
    }
  }
});

export const { setERC721Collective } = erc721CollectiveSlice.actions;

export default erc721CollectiveSlice.reducer;
