import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { clubMember } from '../clubMembers/types';

type tokens = {
  address: string;
  tokenAmount: number;
};

type eth = {
  available: string;
  totalToDistribute: string;
};
export interface GasEstimate {
  tokenSymbol: string;
  tokenAmount: string;
  fiatAmount: any;
}

const initialState: {
  // To Do in future: more strictly define the types
  distributionTokens: any;
  distributionMembers: any;
  eth: any;
  gasEstimate: GasEstimate;
  isLoading: boolean;
} = {
  distributionTokens: [],
  distributionMembers: [],
  eth: {
    available: '0',
    totalToDistribute: '0'
  },
  gasEstimate: {
    tokenSymbol: 'ETH',
    tokenAmount: '0.02',
    fiatAmount: '25'
  },
  isLoading: true
};

/**
 * Responsible for managing the tokens that are being
 * distributed to club members.
 *
 * @param state The current state of the store.
 * @param {tokens} tokens
 * @returns {tokens}
 */
const distributeTokens = createSlice({
  initialState,
  name: 'distributeTokens',
  reducers: {
    setDistributeTokens(state, action: PayloadAction<tokens[]>) {
      state.distributionTokens = action.payload;
    },
    setEth(state, action: PayloadAction<eth>) {
      state.eth = action.payload;
    },
    setGasEstimates(state, action: PayloadAction<any>) {
      state.gasEstimate = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setDistributionMembers(state, action: PayloadAction<clubMember[]>) {
      state.distributionMembers = action.payload;
    }
  }
});

export const {
  setDistributeTokens,
  setEth,
  setGasEstimates,
  setIsLoading,
  setDistributionMembers
} = distributeTokens.actions;

export default distributeTokens.reducer;
