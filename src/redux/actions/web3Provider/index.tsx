import {
  CONNECTED,
  CONNECTING,
  DISCONNECTED,
  HIDE_ERROR_MODAL,
  HIDE_WALLET_MODAL,
  SET_PROVIDER_NAME,
  SET_WEB3,
  SHOW_ERROR_MODAL,
  SHOW_WALLET_MODAL,
  STORE_SYNDICATE_INSTANCE,
  STORE_ETHEREUM_NETWORK,
  STORE_CURRENT_ETH_NETWORK,
} from "../types";

export const storeSyndicateInstance = (data) => async (dispatch) => {
  return dispatch({
    data,
    type: STORE_SYNDICATE_INSTANCE,
  });
};

export const setConnectedProviderName = (providerName) => async (dispatch) => {
  return dispatch({
    data: providerName,
    type: SET_PROVIDER_NAME,
  });
};

export const setLibrary = (data) => async (dispatch) => {
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

interface IError {
  title?: string;
  message: string;
  type: string;
}
export const showErrorModal = (error: IError) => {
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

// store ethereum network properties
interface NetworkProps {
  invalidEthereumNetwork: boolean;
  correctEthereumNetwork: string;
}
/** store ethereum network properties
 * @param {boolean} invalidEthereumNetwork checks whether the user is connected to the correct network.
 * @param {string} correctEthereumNetwork the correct network to connect to.
 *  */
export const storeEthereumNetwork = (data: NetworkProps) => {
  return {
    type: STORE_ETHEREUM_NETWORK,
    data,
  };
};

export const storeCurrentEthNetwork = (networkName: string) => {
  return {
    type: STORE_CURRENT_ETH_NETWORK,
    data: networkName,
  };
};
