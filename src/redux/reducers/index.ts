import { combineReducers } from "redux";
import { web3Reducer } from "./connectWallet";
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
});

export default rootReducer;
