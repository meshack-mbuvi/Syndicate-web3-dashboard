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
  isLoading: boolean;
}

const initialState: {
  // To Do in future: more strictly define the types
  distributionTokens: any;
  distributionMembers: any;
  eth: any;
  gasEstimate: GasEstimate;
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
    fiatAmount: '100',
    isLoading: false
  }
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
    setGasEstimates(state, action: PayloadAction<gasEstimate>) {
      state.gasEstimate = action.payload;
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
  setDistributionMembers
} = distributeTokens.actions;

export default distributeTokens.reducer;
