import { combineReducers } from "redux";
import { web3Reducer } from "./connectWallet";
import { syndicateInvestmentsReducer } from "./syndicateInvestments";

export const rootReducer = combineReducers({
  web3Reducer,
  syndicateInvestmentsReducer,
});

export default rootReducer;
