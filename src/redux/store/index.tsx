import { createWrapper } from "next-redux-wrapper";
import { applyMiddleware, compose, createStore, Action } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk, { ThunkAction } from "redux-thunk";
import RootReducer from "../reducers";

const middleware = [thunk];

export const store = createStore(
  RootReducer,
  composeWithDevTools(compose(applyMiddleware(...middleware)))
);

const makeStore = () => store;

export const wrapper = createWrapper(makeStore);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;
