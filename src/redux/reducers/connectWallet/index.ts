import {
  CONNECTED,
  CONNECTING,
  DISCONNECTED,
  HIDE_ERROR_MODAL,
  HIDE_WALLET_MODAL,
  SET_PROVIDER,
  SET_PROVIDER_NAME,
  SET_WEB3,
  SHOW_ERROR_MODAL,
  SHOW_WALLET_MODAL,
  UNSET_WEB3,
  USER_LOGOUT,
} from "@/redux/actions/types";
import { initialState } from "../initialState";

export const web3Reducer = (state = initialState, action) => {
  const { web3 } = state;
  switch (action.type) {
    case SET_WEB3:
      return {
        ...state,
        web3: { ...web3, status: "connected", ...action.data },
      };

    case SET_PROVIDER_NAME:
      return {
        ...state,
        web3: { ...web3, providerName: action.data },
      };

    case UNSET_WEB3:
      return {
        ...state,
        web3: initialState.web3,
      };
    case SET_PROVIDER:
      return {
        ...state,
        web3: { ...web3, provider: action.data },
      };

    case SHOW_WALLET_MODAL:
      return {
        ...state,
        showWalletModal: true,
      };

    case HIDE_WALLET_MODAL:
      return {
        ...state,
        showWalletModal: false,
      };

    case CONNECTING:
      return {
        ...state,
        web3: { ...web3, status: "connecting" },
      };

    case CONNECTED:
      return {
        ...state,
        web3: { ...web3, status: "connected" },
      };

    case DISCONNECTED:
      return {
        ...state,
        web3: { ...web3, status: "disconnected" },
      };

    case SHOW_ERROR_MODAL:
      return {
        ...state,
        web3: {
          ...web3,
          isErrorModalOpen: true,
          error: action.data,
        },
      };

    case HIDE_ERROR_MODAL:
      return {
        ...state,
        web3: {
          ...web3,
          isErrorModalOpen: false,
          error: null,
        },
      };

    case USER_LOGOUT:
      return {
        ...state,
        web3: { ...web3, ...initialState.web3 },
      };

    default:
      return state;
  }
};
