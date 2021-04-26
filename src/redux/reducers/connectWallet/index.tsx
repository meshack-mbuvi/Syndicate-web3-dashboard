import {
  CONNECTED,
  CONNECTING,
  DISCONNECTED,
  HIDE_WALLET_MODAL,
  SET_PROVIDER,
  SET_WEB3,
  UNSET_WEB3,
  SHOW_WALLET_MODAL,
  SHOW_ERROR_MODAL,
  HIDE_ERROR_MODAL,
  SET_SYNDICATE_ACTION,
} from "src/redux/actions/types";
import { initialState } from "../initialState";

export const web3Reducer = (state = initialState, action) => {
  const { web3, syndicateAction } = state;
  switch (action.type) {
    case SET_WEB3:
      return {
        ...state,
        web3: { ...web3, status: "connected", ...action.data },
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

    case SET_SYNDICATE_ACTION:
      return {
        ...state,
        syndicateAction: { ...syndicateAction, ...action.data },
      };

    default:
      return state;
  }
};
