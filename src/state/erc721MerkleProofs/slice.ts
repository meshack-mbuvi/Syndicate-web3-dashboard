import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IERC721MerkleProof, initialState } from './types';

const setERC721MerkleProofSlice = createSlice({
  name: 'erc721MerkleProof',
  initialState,
  reducers: {
    setERC721MerkleProof(state, action: PayloadAction<IERC721MerkleProof>) {
      const merkle = action.payload;
      state.erc721MerkleProof = merkle;
    },
    setLoadingERC721MerkleProof(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    clearERC721MerkleProof(state, action: PayloadAction<boolean>) {
      state.erc721MerkleProof = initialState.erc721MerkleProof;
    }
  }
});

export const {
  setERC721MerkleProof,
  setLoadingERC721MerkleProof,
  clearERC721MerkleProof
} = setERC721MerkleProofSlice.actions;

export default setERC721MerkleProofSlice.reducer;
