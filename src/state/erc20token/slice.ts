import {
  ActiveModuleDetails,
  TokenGatedRequirementsDetails
} from '@/types/modules';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isEqual } from 'lodash';
import { DepositDetails, ERC20Token, initialState } from './types';

const erc20TokenSlice = createSlice({
  name: 'erc20token',
  initialState,
  reducers: {
    setERC20TokenDetails(state, action: PayloadAction<ERC20Token>) {
      const erc20Token = action.payload;
      if (!isEqual(erc20Token, state.erc20Token)) {
        state.erc20Token = erc20Token;
      }
    },
    setERC20TokenDepositDetails(state, action: PayloadAction<DepositDetails>) {
      const depositDetails = action.payload;
      if (!isEqual(depositDetails, state.depositDetails)) {
        state.depositDetails = depositDetails;
      }
    },
    setERC20TokenContract(state, action: PayloadAction<any>) {
      state.erc20TokenContract = action.payload;
    },
    setLoadingClub(state, action: PayloadAction<boolean>) {
      state.erc20Token.loading = action.payload;
    },
    setTotalDeposits(state, action: PayloadAction<number>) {
      state.erc20Token.totalDeposits = action.payload;
    },
    setTotalSupply(state, action: PayloadAction<number>) {
      state.erc20Token.totalSupply = action.payload;
    },
    setStartTime(state, action: PayloadAction<number>) {
      state.erc20Token.startTime = action.payload;
    },
    setEndTime(state, action: PayloadAction<number>) {
      state.erc20Token.endTime = action.payload;
    },
    setActiveModuleDetails(state, action: PayloadAction<ActiveModuleDetails>) {
      if (!isEqual(action.payload, state?.activeModuleDetails)) {
        state.activeModuleDetails = action.payload;
      }
    },
    setTokenGatingDetails(
      state,
      action: PayloadAction<TokenGatedRequirementsDetails>
    ) {
      if (!isEqual(action.payload, state?.tokenGatingDetails)) {
        state.tokenGatingDetails = action.payload;
      }
    },
    setDepositTokenUSDPrice(state, action: PayloadAction<number>) {
      state.depositTokenPriceInUSD = action.payload;
    },
    setIsNewClub(state, action: PayloadAction<boolean>) {
      state.isNewClub = action.payload;
    }
  }
});

export const {
  setERC20TokenDetails,
  setERC20TokenDepositDetails,
  setERC20TokenContract,
  setLoadingClub,
  setTotalDeposits,
  setTotalSupply,
  setActiveModuleDetails,
  setTokenGatingDetails,
  setDepositTokenUSDPrice,
  setIsNewClub
} = erc20TokenSlice.actions;

export default erc20TokenSlice.reducer;
