import { parse, stringify } from "flatted";
import {
  CONNECTED,
  CONNECTING,
  DISCONNECTED,
  HIDE_ERROR_MODAL,
  HIDE_WALLET_MODAL,
  SET_PROVIDER,
  SET_WEB3,
  UNSET_WEB3,
  SHOW_ERROR_MODAL,
  SHOW_WALLET_MODAL,
  SET_SYNDICATE_ACTION,
} from "./types";

export const setLibrary = (data) => async (dispatch) => {
  // flatten json and store in local storage
  localStorage.setItem("cache", stringify(data));
  return dispatch({
    data,
    type: SET_WEB3,
  });
};

export const getLibrary = () => (dispatch) => {
  const ISSERVER = typeof window === "undefined";

  if (!ISSERVER) {
    const cacheWallet = localStorage.getItem("cache") || null;

    if (cacheWallet) {
      const parseCasheWallet = parse(cacheWallet);
      return dispatch({
        data: parseCasheWallet,
        type: SET_WEB3,
      });
    }
    localStorage.removeItem("cache");
    return dispatch({
      type: UNSET_WEB3,
    });
  }
};

export const setProvider = (data) => async (dispatch) => {
  return dispatch({
    data,
    type: SET_PROVIDER,
  });
};

export const showWalletModal = () => async (dispatch) => {
  return dispatch({
    type: SHOW_WALLET_MODAL,
  });
};

export const hideWalletModal = () => async (dispatch) => {
  return dispatch({
    type: HIDE_WALLET_MODAL,
  });
};

export const setConnecting = () => async (dispatch) => {
  return dispatch({
    type: CONNECTING,
  });
};

export const setConnected = () => async (dispatch) => {
  return dispatch({
    type: CONNECTED,
  });
};

export const setDisConnected = () => async (dispatch) => {
  return dispatch({
    type: DISCONNECTED,
  });
};

export const showErrorModal = (error: string) => {
  return {
    type: SHOW_ERROR_MODAL,
    data: error,
  };
};

export const hideErrorModal = () => {
  return {
    type: HIDE_ERROR_MODAL,
  };
};

export const setSyndicateAction = (data: {
  withdraw: Boolean;
  deposit: Boolean;
  managerView: Boolean;
  generalView: Boolean;
}) => async (dispatch) => {
  return dispatch({
    type: SET_SYNDICATE_ACTION,
    data,
  });
};
