import { web3InstantiationErrorText } from "@/components/syndicates/shared/Constants";
import { ResourceUnavailable } from "@/components/syndicates/shared/Constants/metamaskErrorCodes";
import { logout } from "@/redux/actions/logout";
import { INITIALIZE_CONTRACTS } from "@/redux/actions/types";
import {
  hideErrorModal,
  hideWalletModal,
  setConnected,
  setConnectedProviderName,
  setConnecting,
  setDisConnected,
  setLibrary,
  showErrorModal,
  storeEthereumNetwork,
  storeCurrentEthNetwork,
} from "@/redux/actions/web3Provider";
import { getSyndicateContracts } from "@/syndicateClosedEndFundLogic";
import { Injected, WalletConnect } from "@/utils/connectors";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from "@web3-react/frame-connector";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "@web3-react/walletconnect-connector";
import { parse } from "flatted";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const Web3 = require("web3");
const debugging = process.env.NEXT_PUBLIC_DEBUG;
declare const window: any;

type AuthProviderProps = {
  connectWallet: (providerName: string) => void;
  showSuccessModal: boolean;
  walletConnecting: boolean;
  providerName: string;
  setWalletConnecting: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
  cancelWalletConnection: () => void;
  disconnectWallet: () => void;
};

const ConnectWalletContext = createContext<Partial<AuthProviderProps>>({});

export const useConnectWalletContext = (): Partial<AuthProviderProps> =>
  useContext(ConnectWalletContext);

interface IError extends Error {
  code?: number;
}
/**
 * This method examines a given error to find its type and then returns a
 * custom error message depending on the type of error
 * @param error
 * @returns {string} message indicating the type of error that occurred
 */
const getErrorMessage = (error: IError) => {
  if (error instanceof NoEthereumProviderError) {
    return {
      message: "Install Metamask, then return here to continue",
      type: "NoEthereumProviderError",
    };
  } else if (error instanceof UnsupportedChainIdError) {
    return {
      title: "Unsupported network",
      message:
        "Ensure you are connected to either Mainnet, Ropsten, Kovan, Rinkeby or Goerli",
      type: "UnsupportedChainIdError",
    };
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect ||
    error instanceof UserRejectedRequestErrorFrame
  ) {
    return {
      title: "Connection unsuccessful",
      message: "Please authorize this website to access your Ethereum account.",
      type: "userRejectedError",
    };
  } else if (error.code === ResourceUnavailable) {
    return {
      title: "Connection unsuccessful",
      message: "Please authorize the pending request on your Metamask account",
      type: "resourceUnavailableError",
    };
  } else {
    console.error(error);
    return {
      title: "Connection unsuccessful",
      message:
        "Metamask refused the connection. Try again or contact us if the problem persists.",
      type: "generalError",
    };
  }
};

const ConnectWalletProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {
    web3Reducer: {
      web3: {
        currentEthereumNetwork,
        ethereumNetwork: { invalidEthereumNetwork },
      },
    },
  } = useSelector((state: RootState) => state);

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

  /**
   * Instantiates contract, and adds it together with web3 provider details to
   * store
   */
  const setWeb3 = async (providerName) => {
    if (library) {
      dispatch(setConnecting());

      // initialize contract now
      const contracts = await getSyndicateContracts();

      dispatch({
        data: contracts,
        type: INITIALIZE_CONTRACTS,
      });
      try {
        dispatch(hideErrorModal());
        return dispatch(
          setLibrary({
            account,
            web3,
            providerName,
          }),
        );
      } catch (error) {
        dispatch(setDisConnected());
        dispatch(
          showErrorModal({
            message: web3InstantiationErrorText,
            type: "web3InstantionError",
          }),
        );
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
    // initialize contract now
    getSyndicateContracts().then((contracts) => {
      dispatch({
        data: contracts,
        type: INITIALIZE_CONTRACTS,
      });
    });

    if (cachedWalletData) {
      const { providerName, account } = cachedWalletData;

      setProviderName(providerName);
      dispatch(
        setLibrary({
          account,
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

  // check the network the user is connected to
  // if the application is still on staging (DEBUG = true), it should
  // be connected to the 'rinkeby' network.
  // otherwise it should be connected to mainnet
  const getCurrentEthNetwork = async () => {
    const currentNetwork = await web3.eth.net.getNetworkType();
    dispatch(storeCurrentEthNetwork(currentNetwork));
  };

  useEffect(() => {
    // check current network type
    getCurrentEthNetwork();
  }, [currentEthereumNetwork]);

  useEffect(() => {
    // set up listener to detect network change
    window.ethereum?.on("chainChanged", () => {
      // Handle the new chain.
      setShowSuccessModal(false);
      getCurrentEthNetwork();
    });
  });

  // always show the success modal for only 1 second
  useEffect(() => {
    if (showSuccessModal) {
      setTimeout(() => setShowSuccessModal(false), 1000);
    }
  }, [showSuccessModal]);

  useEffect(() => {
    // we'll check for the correct network using the debug setting from the .env file
    // if debug is set to true, the application has to be on the rinkeby network.
    // otherwise it has to be connected to mainnet.
    if (currentEthereumNetwork && providerName === "Injected") {
      if (debugging === "true" && currentEthereumNetwork !== "rinkeby") {
        dispatch(
          storeEthereumNetwork({
            invalidEthereumNetwork: true,
            correctEthereumNetwork: "rinkeby network",
          }),
        );
      } else if (debugging === "false" && currentEthereumNetwork !== "main") {
        dispatch(
          storeEthereumNetwork({
            invalidEthereumNetwork: true,
            correctEthereumNetwork: "mainnet",
          }),
        );
      } else if (
        (debugging === "true" && currentEthereumNetwork === "rinkeby") ||
        (debugging === "false" && currentEthereumNetwork === "main")
      ) {
        dispatch(
          storeEthereumNetwork({
            invalidEthereumNetwork: false,
            correctEthereumNetwork: "",
          }),
        );
        // show success modal when the user switches to the correct network
        if (account) {
          setShowSuccessModal(true);
        }
      }
    }
  }, [providerName, currentEthereumNetwork]);

  // This handles the connect for a wallet
  const connectWallet = async (providerName) => {
    closeWalletModal();
    setWalletConnecting(true);

    try {
      if (providerName === "Injected") {
        await activateProvider(Injected, providerName);
        if (!invalidEthereumNetwork) {
          setShowSuccessModal(true);
        } else {
          setShowSuccessModal(false);
          setWalletConnecting(true);
        }
      } else if (providerName === "WalletConnect") {
        await activateProvider(WalletConnect, providerName);
        setShowSuccessModal(true);
      }
    } catch (error) {
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

  // Logout section. Handles disconnecting and deletes cache
  const disconnectWallet = async () => {
    if (library?.provider) {
      await deactivate();
    }
    dispatch(logout());
    localStorage.removeItem("cache");
  };

  return (
    <ConnectWalletContext.Provider
      value={{
        connectWallet,
        walletConnecting,
        showSuccessModal,
        providerName,
        setWalletConnecting,
        setShowSuccessModal,
        cancelWalletConnection,
        disconnectWallet,
      }}
    >
      {children}
    </ConnectWalletContext.Provider>
  );
};

export default ConnectWalletProvider;
