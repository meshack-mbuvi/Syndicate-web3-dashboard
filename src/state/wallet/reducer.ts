import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import {
  hideErrorModal,
  hideWalletModal,
  initWalletConnection,
  logout,
  setConnected,
  setConnectedProviderName,
  setConnecting,
  setDisConnected,
  setDispatchCreateFlow,
  setLibrary,
  setShowNetworkDropdownMenu,
  setShowWalletDropdownMenu,
  showErrorModal,
  showWalletModal,
  storeCurrentEthNetwork,
  storeEthereumNetwork
} from './actions';
import { initialState, Status } from './types';

export default createReducer(initialState, (builder) => {
  builder
    .addCase(setConnectedProviderName, (state, action) => {
      return {
        ...state,
        web3: { ...state.web3, providerName: action.payload }
      };
    })
    .addCase(initWalletConnection, (state) => {
      return {
        ...state,
        web3: { ...state.web3, connect: true }
      };
    })
    .addCase(setLibrary, (state, action) => {
      return {
        ...state,
        web3: { ...state.web3, ...action.payload }
      };
    })
    .addCase(showWalletModal, (state) => {
      return {
        ...state,
        showWalletModal: true
      };
    })
    .addCase(hideWalletModal, (state) => {
      return {
        ...state,
        showWalletModal: false
      };
    })
    .addCase(setConnecting, (state) => {
      return {
        ...state,
        web3: { ...state.web3, status: Status.CONNECTING }
      };
    })
    .addCase(setConnected, (state) => {
      return {
        ...state,
        web3: { ...state.web3, status: Status.CONNECTED }
      };
    })
    .addCase(setDisConnected, (state) => {
      return {
        ...state,
        web3: { ...state.web3, status: Status.DISCONNECTED }
      };
    })
    .addCase(showErrorModal, (state, action) => {
      return {
        ...state,
        web3: {
          ...state.web3,
          isErrorModalOpen: true,
          error: action.payload
        }
      };
    })
    .addCase(hideErrorModal, (state) => {
      return {
        ...state,
        web3: {
          ...state.web3,
          isErrorModalOpen: false,
          error: null
        }
      };
    })
    .addCase(storeEthereumNetwork, (state, action) => {
      return {
        ...state,
        web3: {
          ...state.web3,
          ethereumNetwork: action.payload
        }
      };
    })
    .addCase(storeCurrentEthNetwork, (state, action) => {
      return {
        ...state,
        web3: {
          ...state.web3,
          currentEthereumNetwork: action.payload
        }
      };
    })
    .addCase(logout, (state) => {
      return {
        ...state,
        web3: initialState.web3
      };
    })
    .addCase(setDispatchCreateFlow, (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        dispatchCreateFlow: action.payload
      };
    })
    .addCase(
      setShowNetworkDropdownMenu,
      (state, action: PayloadAction<boolean>) => {
        return {
          ...state,
          showNetworkDropdown: action.payload
        };
      }
    )
    .addCase(
      setShowWalletDropdownMenu,
      (state, action: PayloadAction<boolean>) => {
        return {
          ...state,
          showWalletDropdown: action.payload
        };
      }
    );
});
