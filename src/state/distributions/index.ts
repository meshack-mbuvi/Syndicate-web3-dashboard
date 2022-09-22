import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GasEstimate {
  tokenSymbol: string;
  tokenAmount: string;
  fiatAmount: any;
}

const initialState: {
  // To Do in future: more strictly define the types
  distributionMembers: any;
  gasEstimate: GasEstimate;
  isLoading: boolean;
} = {
  distributionMembers: [],
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
    setGasEstimates(state, action: PayloadAction<any>) {
      state.gasEstimate = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    }
  }
});

export const { setGasEstimates, setIsLoading } = distributeTokens.actions;

export default distributeTokens.reducer;
