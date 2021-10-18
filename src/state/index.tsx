import { configureStore, Action, ThunkAction } from "@reduxjs/toolkit";
import { composeWithDevTools } from "redux-devtools-extension";
import { createWrapper } from "next-redux-wrapper";

import { isDev } from "@/utils/environment";

const devToolsEnhancer = composeWithDevTools({ trace: true, traceLimit: 25 });

const store = configureStore({
  reducer: {
    // web3Reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: true }),
  devTools: isDev,
  enhancers: [devToolsEnhancer],
});

export default store;

export const wrapper = createWrapper(() => store, { debug: isDev });
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, AppState, null, Action<string>>;
