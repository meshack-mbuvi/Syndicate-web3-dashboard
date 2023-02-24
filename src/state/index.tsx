import assetsSliceReducer from '@/state/assets/slice';
import initializeContractsReducer from '@/state/contracts';
import createCollectiveSliceReducer from '@/state/createCollective/slice';
import createInvestmentClubSliceReducer from '@/state/createInvestmentClub/slice';
import erc20TokenSliceReducer from '@/state/erc20token/slice';
import erc721TokenSliceReducer from '@/state/erc721token/slice';
import featureFlagClientSliceReducer from '@/state/featureFlagClient/slice';
import legalInfoReducer from '@/state/legalInfo';
import modifyCapTableSlice from '@/state/modifyCapTable/slice';
import modifyClubSettingsReducer from '@/state/modifyClubSettings/slice';
import modifyCollectiveSettingsReducer from '@/state/modifyCollectiveSettings';
import web3Reducer from '@/state/wallet/reducer';
import { isDev } from '@/utils/environment';
import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

export const store = configureStore({
  reducer: {
    createInvestmentClubSliceReducer,
    createCollectiveSliceReducer,
    erc20TokenSliceReducer,
    erc721TokenSliceReducer,
    featureFlagClientSliceReducer,
    web3Reducer,
    initializeContractsReducer,
    assetsSliceReducer,
    legalInfoReducer,
    modifyCapTableSlice,
    modifyClubSettingsReducer,
    modifyCollectiveSettingsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true, serializableCheck: false }),
  devTools: isDev
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = ReturnType<typeof store.dispatch>;
export type AppThunk = ThunkAction<void, AppState, null, Action<string>>;

export const wrapper = createWrapper<AppState>(() => store);
