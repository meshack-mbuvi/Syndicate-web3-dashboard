import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type tokens = {
  address: string;
  tokenAmount: number;
};

type eth = {
  available: string;
  totalToDistribute: string;
};

type gasEstimate = {
  tokenSymbol: string;
  tokenAmount: string;
  fiatAmount: string;
  isLoading: boolean;
};

const initialState = {
  distributionTokens: [],
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
    }
  }
});

export const { setDistributeTokens, setEth, setGasEstimates } =
  distributeTokens.actions;

export default distributeTokens.reducer;
