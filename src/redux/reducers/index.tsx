import { combineReducers } from "redux";
import { web3Reducer } from "./connectWallet";
import { loadingReducer } from "./helpers";
import { syndicatesReducer } from "./syndicates";
import { syndicateDetailsReducer } from "./syndicateDetails";
import { syndicateLPDetailsReducer } from "./syndicateLPDetails";

export const rootReducer = combineReducers({
  web3Reducer,
  syndicatesReducer,
  loadingReducer,
  syndicateDetailsReducer,
  syndicateLPDetailsReducer,
});

export default rootReducer;
