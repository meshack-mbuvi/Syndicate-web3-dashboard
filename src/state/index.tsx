import airdopInfoSliceReducer from '@/state/airdropInfo/slice';
import setCollectibleDetailsSliceReducer from '@/state/assets/collectibles/slice';
import assetsSliceReducer from '@/state/assets/slice';
import claimedERC721SliceReducer from '@/state/claimedERC721/slice';
import tokenClaimedSliceReducer from '@/state/claimedToken/slice';
import clubERC20sReducer from '@/state/clubERC20';
import connectClubMemberReducer from '@/state/connectMember';
import initializeContractsReducer from '@/state/contracts';
import createCollectiveSliceReducer from '@/state/createCollective/slice';
import createInvestmentClubSliceReducer from '@/state/createInvestmentClub/slice';
import distributeTokensReducer from '@/state/distributions';
import erc20TokenSliceReducer from '@/state/erc20token/slice';
import transactionsReducer from '@/state/erc20transactions/index';
import erc721AirdropInfoSliceReducer from '@/state/erc721AirdropInfo/slice';
import erc721MerkleProofSliceReducer from '@/state/erc721MerkleProofs/slice';
import erc721TokenSliceReducer from '@/state/erc721token/slice';
import featureFlagClientSliceReducer from '@/state/featureFlagClient/slice';
import legalInfoReducer from '@/state/legalInfo';
import merkleProofSliceReducer from '@/state/merkleProofs/slice';
import modalsReducer from '@/state/modals';
import modifyCapTableSlice from '@/state/modifyCapTable/slice';
import modifyClubSettingsReducer from '@/state/modifyClubSettings/slice';
import utilityNFTSliceReducer from '@/state/UtilityNFT/slice';
import modifyCollectiveSettingsReducer from '@/state/modifyCollectiveSettings';
import web3Reducer from '@/state/wallet/reducer';
import { isDev } from '@/utils/environment';
import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

export const store = configureStore({
  reducer: {
    clubERC20sReducer,
    createInvestmentClubSliceReducer,
    createCollectiveSliceReducer,
    erc20TokenSliceReducer,
    erc721TokenSliceReducer,
    featureFlagClientSliceReducer,
    modalsReducer,
    web3Reducer,
    initializeContractsReducer,
    assetsSliceReducer,
    transactionsReducer,
    legalInfoReducer,
    merkleProofSliceReducer,
    tokenClaimedSliceReducer,
    airdopInfoSliceReducer,
    erc721MerkleProofSliceReducer,
    erc721AirdropInfoSliceReducer,
    claimedERC721SliceReducer,
    modifyCapTableSlice,
    setCollectibleDetailsSliceReducer,
    utilityNFTSliceReducer,
    modifyClubSettingsReducer,
    connectClubMemberReducer,
    distributeTokensReducer,
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
