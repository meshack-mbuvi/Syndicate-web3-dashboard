import { combineReducers } from "redux";
import { web3Reducer } from "./connectWallet";
import { loadingReducer } from "./helpers";
import { syndicatesReducer } from "./syndicates";
import { syndicateDetailsReducer } from "./syndicateDetails";
import { syndicateMemberDetailsReducer } from "./syndicateMemberDetails";
import { syndicateInstanceReducer } from "./syndicateInstance";
import { tokenDetailsReducer } from "./tokenAllowances";

export const rootReducer = combineReducers({
  web3Reducer,
  syndicatesReducer,
  loadingReducer,
  syndicateDetailsReducer,
  syndicateMemberDetailsReducer,
  syndicateInstanceReducer,
  tokenDetailsReducer,
});

export default rootReducer;
