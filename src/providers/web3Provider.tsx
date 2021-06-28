import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";
import React from "react";

/**
 * This function configures web3 integration
 * @param {*} provider is passed by web3ReactProvider
 */
const getLibrary = (provider) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};

const SyndicateWeb3ReactProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>
  );
};

export default SyndicateWeb3ReactProvider;
