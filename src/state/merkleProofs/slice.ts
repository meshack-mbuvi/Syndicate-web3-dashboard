import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MerkleProof, initialState } from "./types";

const setMerkleProofSlice = createSlice({
  name: "merkleProof",
  initialState,
  reducers: {
    setMerkleProof(state, action: PayloadAction<MerkleProof>) {
      const merkle = action.payload;
      state.myMerkleProof = merkle;
    },
    setLoadingMerkleProof(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    clearMerkleProof(state, action: PayloadAction<boolean>) {
      state.myMerkleProof = initialState.myMerkleProof;
    },
  },
});

export const { setMerkleProof, setLoadingMerkleProof, clearMerkleProof } =
  setMerkleProofSlice.actions;

export default setMerkleProofSlice.reducer;
