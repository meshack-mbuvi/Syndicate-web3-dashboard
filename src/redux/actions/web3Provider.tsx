import {
  CONNECTED,
  CONNECTING,
  DISCONNECTED,
  HIDE_ERROR_MODAL,
  HIDE_WALLET_MODAL,
  SET_PROVIDER,
  SET_WEB3,
  SHOW_ERROR_MODAL,
  SHOW_WALLET_MODAL,
  DEPOSIT_MODE,
  WITHDRAWAL_MODE,
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

export const setDepositMode = () => async (dispatch) => {
  return dispatch({
    type: DEPOSIT_MODE,
    status,
  });
};

export const setWithdrawalMode = (status) => async (dispatch) => {
  return dispatch({
    type: WITHDRAWAL_MODE,
    status,
  });
};
