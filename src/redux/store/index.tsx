import { createWrapper } from "next-redux-wrapper";
import { applyMiddleware, compose, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import RootReducer from "../reducers";

const middleware = [thunk];

export const store = createStore(
  RootReducer,
  composeWithDevTools(compose(applyMiddleware(...middleware)))
);

const makeStore = () => store;

export const wrapper = createWrapper(makeStore);
