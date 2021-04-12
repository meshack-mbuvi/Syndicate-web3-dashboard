import { combineReducers } from "redux";
import { web3Reducer } from "./connectWallet";
import { loadingReducer } from "./helpers";
import { syndicatesReducer } from "./syndicates";

export const rootReducer = combineReducers({
  web3Reducer,
  syndicatesReducer,
  loadingReducer,
});

export default rootReducer;
