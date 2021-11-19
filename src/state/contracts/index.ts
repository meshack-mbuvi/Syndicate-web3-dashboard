import { ClubERC20Factory } from "@/ClubERC20Factory/clubERC20Factory";
import { MintPolicyContract } from "@/ClubERC20Factory/mintPolicy";
import { SingleTokenMintModuleContract } from "@/ClubERC20Factory/singleTokenMintModule";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ISyndicateContracts {
  clubERC20Factory: ClubERC20Factory;
  mintPolicy: MintPolicyContract;
  SingleTokenMintModule: SingleTokenMintModuleContract;
}

interface InitialState {
  syndicateContracts: ISyndicateContracts;
}

const initialState: InitialState = {
  syndicateContracts: {
    clubERC20Factory: null,
    mintPolicy: null,
    SingleTokenMintModule: null,
  }
}

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
