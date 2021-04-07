import { combineReducers } from "redux";
import { web3Reducer } from "./connectWallet";
import { syndicatesReducer } from "./syndicates";

export const rootReducer = combineReducers({
  web3Reducer,
  syndicatesReducer,
});

export default rootReducer;
