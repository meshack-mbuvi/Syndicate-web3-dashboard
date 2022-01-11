import { ClubERC20Factory } from "@/ClubERC20Factory/clubERC20Factory";
import { MerkleDistributorModuleContract } from "@/ClubERC20Factory/merkleDistributorModule";
import { MerkleDistributorModuleERC721Contract } from "@/ClubERC20Factory/merkleDistributorModuleERC721";
import { MintPolicyContract } from "@/ClubERC20Factory/mintPolicy";
import { PublicOnePerAddressModuleContract } from "@/ClubERC20Factory/publicOnePerAddressModule";
import { ERC721MintPolicyContract } from "@/ClubERC20Factory/mintPolicyERC721";
import { SingleTokenMintModuleContract } from "@/ClubERC20Factory/singleTokenMintModule";
import { RugUtilityMintModuleContract } from "@/ClubERC20Factory/rugUtilityMintModule";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface ISyndicateContracts {
  clubERC20Factory: ClubERC20Factory;
  mintPolicy: MintPolicyContract;
  SingleTokenMintModule: SingleTokenMintModuleContract;
  MerkleDistributorModule: MerkleDistributorModuleContract;
  MerkleDistributorModuleERC721: MerkleDistributorModuleERC721Contract;
  PublicOnePerAddressModule: PublicOnePerAddressModuleContract;
  mintPolicyERC721: ERC721MintPolicyContract;
  RugUtilityMintModule: RugUtilityMintModuleContract;
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
    MerkleDistributorModuleERC721: null,
    PublicOnePerAddressModule: null,
    mintPolicyERC721: null,
    RugUtilityMintModule: null,
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
