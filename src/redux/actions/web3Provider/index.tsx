import { stringify } from "flatted";
import {
  CONNECTED,
  CONNECTING,
  DISCONNECTED,
  HIDE_ERROR_MODAL,
  HIDE_WALLET_MODAL,
  SET_SYNDICATE_ACTION,
  SET_WEB3,
  SHOW_ERROR_MODAL,
  SHOW_WALLET_MODAL,
  STORE_SYNDICATE_INSTANCE,
} from "../types";

export const storeSyndicateInstance = (data) => async (dispatch) => {
  return dispatch({
    data,
    type: STORE_SYNDICATE_INSTANCE,
  });
};

export const setLibrary = (data) => async (dispatch) => {
  // flatten json and store in local storage
  localStorage.setItem("cache", stringify(data));
  return dispatch({
    data,
    type: SET_WEB3,
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

export const getWeb3 = () => (dispatch, getState) => {
  // grab current state
  const state = getState();

  return state;
};
