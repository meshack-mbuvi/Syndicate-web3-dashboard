import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  initialState,
  mintEndTime,
  ICurrentSelectedToken,
  LogicalOperator,
  tokenDetails,
  TokenGateOption,
  TokenGateRule
} from './types';

const createInvestmentClubSlice = createSlice({
  name: 'createInvestmentClub',
  initialState,
  reducers: {
    setInvestmentClubName(state, action: PayloadAction<string>) {
      state.investmentClubName = action.payload;
    },
    setInvestmentClubSymbolPlaceHolder(state, action: PayloadAction<string>) {
      state.investmentClubSymbolPlaceHolder = action.payload;
      state.investmentClubSymbol = `${action.payload}`;
    },
    setMembersCount(state, action: PayloadAction<string>) {
      state.membersCount = action.payload;
    },
    setTokenCap(state, action: PayloadAction<string>) {
      state.tokenCap = action.payload;
    },
    setMintEndTime(state, action: PayloadAction<mintEndTime>) {
      state.mintEndTime = action.payload;
    },
    setMintSpecificEndTime(state, action: PayloadAction<string>) {
      state.mintSpecificEndTime = action.payload;
    },
    setTransactionHash(state, action: PayloadAction<string>) {
      state.clubCreationStatus.transactionHash = action.payload;
    },
    setClubCreationReceipt(state, action) {
      state.clubCreationStatus.creationReceipt = action.payload;
    },
    resetClubCreationReduxState: () => initialState,
    setDepositTokenDetails(state, action: PayloadAction<tokenDetails>) {
      state.tokenDetails = action.payload;
    },
    setMembershipAddresses(state, action: PayloadAction<string[]>) {
      state.membershipAddresses = action.payload;
    },
    setMemberAddressesError(state, action: PayloadAction<string>) {
      state.errors.memberAddresses = action.payload;
    },
    setActiveTokenGateOption(state, action: PayloadAction<TokenGateOption>) {
      state.tokenGateOption = action.payload;
    },
    setAmountToMintPerAddress(state, action: PayloadAction<number>) {
      state.amountToMintPerAddress = action.payload;
    },
    setShowTokenGateModal(state, action: PayloadAction<boolean>) {
      state.showTokenGateModal = action.payload;
    },
    setShowImportTokenModal(state, action: PayloadAction<boolean>) {
      state.showImportTokenModal = action.payload;
    },
    setCurrentSelectedToken(
      state,
      action: PayloadAction<ICurrentSelectedToken>
    ) {
      state.currentSelectedToken = {
        ...state.currentSelectedToken,
        ...action.payload
      };
    },
    setTokenRules(state, action: PayloadAction<TokenGateRule[]>) {
      state.tokenRules = action.payload;
    },
    setDuplicateRulesError(state, action: PayloadAction<number[]>) {
      state.errors.duplicateRules = action.payload;
    },
    setNullRulesError(state, action: PayloadAction<number[]>) {
      state.errors.nullRules = action.payload;
    },
    setMoreThanFiveRules(state, action: PayloadAction<boolean>) {
      state.errors.hasMoreThanFiveRules = action.payload;
    },
    setLogicalOperator(state, action: PayloadAction<LogicalOperator>) {
      state.logicalOperator = action.payload;
    }
  }
});

export const {
  setInvestmentClubName,
  setInvestmentClubSymbolPlaceHolder,
  setMembersCount,
  setTokenCap,
  setMintEndTime,
  setMintSpecificEndTime,
  setTransactionHash,
  setClubCreationReceipt,
  resetClubCreationReduxState,
  setDepositTokenDetails,
  setMembershipAddresses,
  setMemberAddressesError,
  setActiveTokenGateOption,
  setAmountToMintPerAddress,
  setShowTokenGateModal,
  setShowImportTokenModal,
  setCurrentSelectedToken,
  setTokenRules,
  setDuplicateRulesError,
  setNullRulesError,
  setMoreThanFiveRules,
  setLogicalOperator
} = createInvestmentClubSlice.actions;
export default createInvestmentClubSlice.reducer;
