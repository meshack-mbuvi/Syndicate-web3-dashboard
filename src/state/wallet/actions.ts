import { createAction } from "@reduxjs/toolkit";
import { IEthereumNetwork, IModalErrors, IWeb3Library } from "./types";

export const setConnectedProviderName = createAction<string>("wallet/setConnectedProviderName");
export const initWalletConnection = createAction("wallet/initWalletConnection");
export const setLibrary = createAction<IWeb3Library>("wallet/setLibrary");
export const showWalletModal = createAction("wallet/showWalletModal");
export const hideWalletModal = createAction("wallet/hideWalletModal");
export const setConnecting = createAction("wallet/setConnecting");
export const setConnected = createAction("wallet/setConnected");
export const setDisConnected = createAction("wallet/setDisConnected");
export const showErrorModal = createAction<IModalErrors>("wallet/showErrorModal");
export const hideErrorModal = createAction("wallet/hideErrorModal");
export const storeEthereumNetwork = createAction<IEthereumNetwork>("wallet/storeEthereumNetwork");
export const storeCurrentEthNetwork = createAction<string>("wallet/storeCurrentEthNetwork");
export const logout = createAction("wallet/logout");
