import { isDev } from "@/utils/environment";
import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { composeWithDevTools } from "redux-devtools-extension";

const devToolsEnhancer = composeWithDevTools({ trace: true, traceLimit: 25 });

const store = configureStore({
  reducer: {
    // web3Reducer,
    // createInvestmentClubSliceReducer,
    // erc20TokenSliceReducer,
    // clubMembersSlice
    // modalsReducer,
    // createInvestmentClubSliceReducer,
    // clubERC20sReducer,
    // clubMembersSliceReducer,
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
