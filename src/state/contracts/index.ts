import { ClubERC20Factory } from "@/ClubERC20Factory/clubERC20Factory";
import { MerkleDistributorModuleContract } from "@/ClubERC20Factory/merkleDistributorModule";
import { MintPolicyContract } from "@/ClubERC20Factory/mintPolicy";
import { SingleTokenMintModuleContract } from "@/ClubERC20Factory/singleTokenMintModule";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface ISyndicateContracts {
  clubERC20Factory: ClubERC20Factory;
  mintPolicy: MintPolicyContract;
  SingleTokenMintModule: SingleTokenMintModuleContract;
  MerkleDistributorModule: MerkleDistributorModuleContract;
}

interface InitialState {
  syndicateContracts: ISyndicateContracts;
}

const initialState: InitialState = {
  syndicateContracts: {
    clubERC20Factory: null,
    mintPolicy: null,
    SingleTokenMintModule: null,
    MerkleDistributorModule: null,
  },
};

const initializeContractsSlice = createSlice({
  name: "Initialize Contracts",
  initialState,
  reducers: {
    setContracts(state, action: PayloadAction<ISyndicateContracts>) {
      state.syndicateContracts = action.payload;
    },
  },
});

export const { setContracts } = initializeContractsSlice.actions;
export default initializeContractsSlice.reducer;
