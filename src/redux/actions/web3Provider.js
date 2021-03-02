import {
  SET_WEB3,
  SET_PROVIDER,
  CONNECTING,
  DISCONNECTED,
  CONNECTED,
  SHOW_WALLET_MODAL,
  HIDE_WALLET_MODAL,
} from "./types";

export const setLibrary = (data) => async (dispatch) => {
  return dispatch({
    data,
    type: SET_WEB3,
  });
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
