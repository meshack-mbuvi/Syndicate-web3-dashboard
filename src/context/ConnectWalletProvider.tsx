import { web3InstantiationErrorText } from "@/components/syndicates/shared/Constants";
import {
  setConnectedProviderName,
  setDisConnected,
  setConnected,
  showErrorModal,
  hideErrorModal,
  setConnecting,
  setLibrary,
  storeSyndicateInstance,
  hideWalletModal,
} from "@/redux/actions/web3Provider";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "@web3-react/walletconnect-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from "@web3-react/frame-connector";
import { parse } from "flatted";

import Syndicate from "src/contracts/Syndicate.json";
import { Injected, WalletConnect } from "@/utils/connectors";

const Web3 = require("web3");

const contractAddress = process.env.NEXT_PUBLIC_SYNDICATE_CONTRACT_ADDRESS;

const daiABI = require("src/utils/abi/dai");
const daiContractAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";

type AuthProviderProps = {
  connectWallet: (providerName: string) => void;
  showSuccessModal: boolean;
  walletConnecting: boolean;
  setWalletConnecting: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
  cancelWalletConnection: () => void;
};

const ConnectWalletContext = createContext<Partial<AuthProviderProps>>({});

export const useConnectWalletContext = () => useContext(ConnectWalletContext);

/**
 * This method examines a given error to find its type and then returns a
 * custom error message depending on the type of error
 * @param error
 * @returns {string} message indicating the type of error that occured
 */
const getErrorMessage = (error: Error) => {
  if (error instanceof NoEthereumProviderError) {
    return `No Ethereum browser extension detected, install MetaMask on desktop using this link 
        <a href='https://metamask.io/' target="_blank" class='text-blue hover:underline'>https://metamask.io/</a> 
        then <a class='text-blue hover:underline' href="javascript:window.location.reload(false);">refresh</a> 
        the page,  or visit from a dApp browser on mobile.`;
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network. Ensure you are connected to either Mainnet, Ropsten, Kovan, Rinkeby or Goerli";
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect ||
    error instanceof UserRejectedRequestErrorFrame
  ) {
    return "Please authorize this website to access your Ethereum account.";
  } else {
    console.error(error);
    return "An unknown error occurred. Check the console for more details.";
  }
};

const ConnectWalletProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // control whether to show success connection modal or not
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [walletConnecting, setWalletConnecting] = useState(false);
  const [cachedWalletData, setCachedWalletData] = useState(null);
  const [providerName, setProviderName] = useState("");

  const dispatch = useDispatch();

  // activate method handles connection to any wallet account while library will
  // contain the web3 provider selected
  const { activate, library, deactivate, account } = useWeb3React();

  /**
   * set up web3 event listener here
   * we can use to get access to all events emitted by the contract
   *
   */
  const web3 = new Web3(
    Web3.givenProvider || `${process.env.NEXT_PUBLIC_INFURA_ENDPOINT}`,
  );

  const syndicateContractInstance = new web3.eth.Contract(
    // @ts-ignore
    Syndicate.abi,
    contractAddress,
  );

  /**
   * Instantiates contract, and adds it together with web3 provider details to
   * store
   */
  const setWeb3 = async (providerName) => {
    dispatch(storeSyndicateInstance(syndicateContractInstance));

    if (library) {
      dispatch(setConnecting());

      // set up DAI contract
      const daiContract = new web3.eth.Contract(daiABI, daiContractAddress);

      try {
        dispatch(hideErrorModal());
        return dispatch(
          setLibrary({
            account,
            syndicateContractInstance,
            daiContract,
            web3,
            providerName,
          }),
        );
      } catch (error) {
        dispatch(setDisConnected());
        dispatch(showErrorModal(web3InstantiationErrorText));
      }
    }
  };

  useEffect(() => {
    setWeb3(providerName);
  }, [activate, account, providerName, library]);

  //   handles setting localstorage wallet information to the state
  useEffect(() => {
    const cacheWallet = localStorage.getItem("cache") || null;
    if (cacheWallet) {
      const parseCacheWallet = parse(cacheWallet);
      setCachedWalletData(parseCacheWallet);
    }
  }, []);

  useEffect(() => {
    if (cachedWalletData) {
      const { providerName, account } = cachedWalletData;
      setProviderName(providerName);
      dispatch(
        setLibrary({
          account,
          syndicateContractInstance,
          web3,
          providerName,
        }),
      );
    }
  }, [cachedWalletData]);

  //   handles activating provider for  localstorage wallet
  useEffect(() => {
    Injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        if (providerName === "Injected") {
          activateProvider(Injected, "Injected");
        } else if (providerName === "WalletConnect") {
          activateProvider(WalletConnect, "WalletConnect");
        }
      }
    });
  }, [providerName]);

  /**
   * This activate any provide passed to the function where
   * provider can be injected provider, walletConnect or gnosis wallet provider
   * @param {*} provider
   */
  const activateProvider = async (provider, providerName) => {
    dispatch(setConnectedProviderName(providerName));
    setProviderName(providerName);
    if (library?.provider) {
      await deactivate();
      dispatch(setDisConnected());
    }
    await activate(provider, undefined, true);
    // provider is connected, this stops the loader modal
    dispatch(setConnected());
    await setWeb3(providerName);
  };

  // This handles closing the modal after user selects a provider to activate
  const closeWalletModal = () => {
    dispatch(hideWalletModal());
  };

  // This handles the connect for a wallet
  const connectWallet = async (providerName) => {
    closeWalletModal();
    setWalletConnecting(true);
    try {
      if (providerName === "Injected") {
        await activateProvider(Injected, providerName);
      } else if (providerName === "WalletConnect") {
        await activateProvider(WalletConnect, providerName);
      }
      setShowSuccessModal(true);
    } catch (error) {
      console.log({ error });
      const customError = getErrorMessage(error);
      dispatch(showErrorModal(customError));
    }
    // set loader to false after process is complete
    setWalletConnecting(false);

    // close wallet connection modal
    closeWalletModal();
  };

  const cancelWalletConnection = async () => {
    // set the wallet connection status to disconnected; this stops
    // the loader modal
    dispatch(setDisConnected());
    setWalletConnecting(false);
  };

  return (
    <ConnectWalletContext.Provider
      value={{
        connectWallet,
        walletConnecting,
        showSuccessModal,
        setWalletConnecting,
        setShowSuccessModal,
        cancelWalletConnection,
      }}
    >
      {children}
    </ConnectWalletContext.Provider>
  );
};

export default ConnectWalletProvider;
