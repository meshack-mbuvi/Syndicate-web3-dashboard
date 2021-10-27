import { combineReducers } from "redux";
import {
  syndicateOffChainDataReducer,
  tokenAndDepositLimitReducer,
  feesAndDistributionReducer,
  modifiableReducer,
  allowlistReducer,
  closeDateAndTimeReducer,
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

// @redux/toolkit migration
import web3Reducer from "@/state/wallet/reducer";
import Modals from "@/state/modals";
import createInvestmentClubSliceReducer from "@/state/createInvestmentClub/slice";

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
  modalsReducer: Modals,
  createInvestmentClubSliceReducer,
});

export default rootReducer;
