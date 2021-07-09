import { combineReducers } from "redux";
import { web3Reducer } from "./connectWallet";
import { loadingReducer } from "./helpers";
import { initializeContractsReducer } from "./initializeContracts";
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
});

export default rootReducer;
