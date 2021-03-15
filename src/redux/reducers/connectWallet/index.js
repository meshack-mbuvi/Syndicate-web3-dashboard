import { initialState } from "../initialState";
import {
  SET_WEB3,
  SET_PROVIDER,
  CONNECTING,
  CONNECTED,
  DISCONNECTED,
  SHOW_WALLET_MODAL,
  HIDE_WALLET_MODAL,
} from "src/redux/actions/types";

export const web3Reducer = (state = initialState, action) => {
  const { web3 } = state;

  switch (action.type) {
    case SET_WEB3:
      return {
        ...state,
        web3: { ...web3, ...action.data },
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

    default:
      return state;
  }
};
