import {
  CONNECTED,
  CONNECTING,
  DISCONNECTED,
  HIDE_WALLET_MODAL,
  SET_PROVIDER,
  SET_WEB3,
  SHOW_WALLET_MODAL,
  SHOW_ERROR_MODAL,
  HIDE_ERROR_MODAL,
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
    data: error
  }
}

export const hideErrorModal = () => {
  return {
    type: HIDE_ERROR_MODAL
  }
}