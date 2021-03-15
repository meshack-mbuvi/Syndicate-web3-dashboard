import { combineReducers } from "redux";
import { web3Reducer } from "./connectWallet";
export const rootReducer = combineReducers({
  web3Reducer,
});

export default rootReducer;
