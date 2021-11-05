import clubERC20sReducer from "@/state/clubERC20";
import clubMembersSliceReducer from "@/state/clubMembers";
import createInvestmentClubSliceReducer from "@/state/createInvestmentClub/slice";
import erc20TokenSliceReducer from "@/state/erc20token/slice";
import modalsReducer from "@/state/modals";
// @redux/toolkit migration
import web3Reducer from "@/state/wallet/reducer";
import { combineReducers } from "redux";
import {
  allowlistReducer,
  closeDateAndTimeReducer,
  feesAndDistributionReducer,
  modifiableReducer,
  syndicateOffChainDataReducer,
  tokenAndDepositLimitReducer,
  transferableReducer,
} from "./createSyndicate";
import { loadingReducer } from "./helpers";
import { initializeContractsReducer } from "./initializeContracts";
import { manageActionsReducer } from "./manageActions";
import { manageMembersDetailsReducer } from "./manageMembers";
import { syndicateDetailsReducer } from "./syndicateDetails";
import { syndicateMemberDetailsReducer } from "./syndicateMemberDetails";
import { syndicatesReducer } from "./syndicates";
import { tokenDetailsReducer } from "./tokenAllowances";

export const rootReducer = combineReducers({
  web3Reducer,
  syndicatesReducer,
  loadingReducer,
  syndicateDetailsReducer,
  syndicateMemberDetailsReducer,
  tokenDetailsReducer,
  initializeContractsReducer,
  manageMembersDetailsReducer,
  manageActionsReducer,
  tokenAndDepositLimitReducer,
  syndicateOffChainDataReducer,
  feesAndDistributionReducer,
  modifiableReducer,
  allowlistReducer,
  closeDateAndTimeReducer,
  transferableReducer,
  modalsReducer,
  createInvestmentClubSliceReducer,
  erc20TokenSliceReducer,
  clubERC20sReducer,
  clubMembersSliceReducer,
});

export default rootReducer;
