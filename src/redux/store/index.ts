import { createWrapper } from "next-redux-wrapper";
import { Action, applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk, { ThunkAction } from "redux-thunk";
import RootReducer from "../reducers";

const middleware = [thunk];

const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 });

export const store = createStore(RootReducer, composeEnhancers(
  applyMiddleware(...middleware)
));

const makeStore = () => store;

export const wrapper = createWrapper(makeStore);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;
