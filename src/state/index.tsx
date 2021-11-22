import { isDev } from "@/utils/environment";
import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";

import clubERC20sReducer from "@/state/clubERC20";
import clubMembersSliceReducer from "@/state/clubMembers";
import createInvestmentClubSliceReducer from "@/state/createInvestmentClub/slice";
import erc20TokenSliceReducer from "@/state/erc20token/slice";
import modalsReducer from "@/state/modals";
import web3Reducer from "@/state/wallet/reducer";
import initializeContractsReducer from "@/state/contracts";
import assetsSliceReducer from "@/state/assets/slice";

export const store = configureStore({
  reducer: {
    clubERC20sReducer,
    clubMembersSliceReducer,
    createInvestmentClubSliceReducer,
    erc20TokenSliceReducer,
    modalsReducer,
    web3Reducer,
    initializeContractsReducer,
    assetsSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true, serializableCheck: false }),
  devTools: isDev,
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = ReturnType<typeof store.dispatch>;
export type AppThunk = ThunkAction<void, AppState, null, Action<string>>;

export const wrapper = createWrapper<AppState>(() => store);
