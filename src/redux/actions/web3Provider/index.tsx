import { Dispatch, Action, AnyAction } from "redux";
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
  CONNECT,
} from "../types";

export const storeSyndicateInstance =
  (data: any) =>
  (dispatch: Dispatch): AnyAction => {
    return dispatch({
      data,
      type: STORE_SYNDICATE_INSTANCE,
    });
  };

export const setConnectedProviderName =
  (providerName: any) =>
  (dispatch: Dispatch): AnyAction => {
    return dispatch({
      data: providerName,
      type: SET_PROVIDER_NAME,
    });
  };

export const initWalletConnection =
  () =>
  (dispatch: Dispatch): Action => {
    return dispatch({
      type: CONNECT,
    });
  };

export const setLibrary =
  (data: any) =>
  (dispatch: Dispatch): AnyAction => {
    return dispatch({
      data,
      type: SET_WEB3,
    });
  };

export const showWalletModal =
  () =>
  (dispatch: Dispatch): Action => {
    return dispatch({
      type: SHOW_WALLET_MODAL,
    });
  };

export const hideWalletModal =
  () =>
  (dispatch: Dispatch): Action => {
    return dispatch({
      type: HIDE_WALLET_MODAL,
    });
  };

export const setConnecting =
  () =>
  (dispatch: Dispatch): Action => {
    return dispatch({
      type: CONNECTING,
    });
  };

export const setConnected =
  () =>
  (dispatch: Dispatch): Action => {
    return dispatch({
      type: CONNECTED,
    });
  };

export const setDisConnected =
  () =>
  (dispatch: Dispatch): Action => {
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
