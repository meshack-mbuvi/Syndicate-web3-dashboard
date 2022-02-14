/* eslint-disable react-hooks/exhaustive-deps */
import { getSyndicateContracts } from "@/ClubERC20Factory";
import { Flow, amplitudeLogger } from "@/components/amplitude";
import {
  ERROR_WALLET_CONNECTION,
  SUCCESSFUL_WALLET_CONNECT,
} from "@/components/amplitude/eventNames";
import { web3InstantiationErrorText } from "@/components/syndicates/shared/Constants";
import { AppState } from "@/state";
import { setContracts } from "@/state/contracts";
import {
  hideErrorModal,
  hideWalletModal,
  logout,
  setConnected,
  setConnectedProviderName,
  setConnecting,
  setDisConnected,
  setLibrary,
  showErrorModal,
  storeCurrentEthNetwork,
  storeEthereumNetwork,
} from "@/state/wallet/actions";
import { SafeAppWeb3Modal } from "@gnosis.pm/safe-apps-web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers } from "ethers";
import { parse, stringify } from "flatted";
import { isEmpty } from "lodash";
import router from "next/router";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";

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
  loadedAsSafeApp: boolean;
};

const ConnectWalletContext = createContext<Partial<AuthProviderProps>>({});

export const useConnectWalletContext = (): Partial<AuthProviderProps> =>
  useContext(ConnectWalletContext);

/**
 * This method examines a given error to find its type and then returns a
 * custom error message depending on the type of error
 * @param error
 * @returns {string} message indicating the type of error that occurred
 */
const getErrorMessage = () => {
  return {
    title: "Connection unsuccessful",
    message: "Please authorize this website to access your Ethereum account.",
    type: "generalError",
  };
};

const ConnectWalletProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {
    web3Reducer: {
      web3: { currentEthereumNetwork },
    },
  } = useSelector((state: AppState) => state);

  const initialWeb3 = new Web3(`${process.env.NEXT_PUBLIC_ALCHEMY}`);

  // control whether to show success connection modal or not
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [walletConnecting, setWalletConnecting] = useState(false);
  const [cachedWalletData, setCachedWalletData] = useState(null);
  const [providerName, setProviderName] = useState("");
  const [activeProvider, setActiveProvider] = useState(null);
  const [account, setAccount] = useState("");
  const [loadedAsSafeApp, setLoadedAsSafeApp] = useState(false);
  const [web3, initializeWeb3] = useState(initialWeb3);

  const dispatch = useDispatch();

  // Setup provider options for web3modal
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        rpc: {
          1: `${process.env.NEXT_PUBLIC_ALCHEMY_MAINNET}`,
          4: `${process.env.NEXT_PUBLIC_ALCHEMY_RINKEBY}`,
          137: `${process.env.NEXT_PUBLIC_ALCHMEY_POLYGON}`,
        },
      },
    },
  };

  /*
   * Allows running as a gnosis safe app
   * This checks and connects automatially in gnosis safe.
   * Needs `public/manifest.json` to work.
   */
  const checkGnosis = async (w3Modal) => {
    const isSafeApp = await w3Modal.isSafeApp();
    await setLoadedAsSafeApp(isSafeApp);
  };

  // Initialize web3modal
  let web3Modal;
  if (typeof window !== "undefined") {
    web3Modal = new SafeAppWeb3Modal({
      cacheProvider: true,
      providerOptions, // required
    });
    checkGnosis(web3Modal);
  }

  /**
   * Instantiates contract, and adds it together with web3 provider details to
   * store
   */
  const setWeb3 = async () => {
    // initialize contract now
    const contracts = await getSyndicateContracts(web3);

    dispatch(setContracts(contracts));
    try {
      dispatch(hideErrorModal());
      if (account && activeProvider) {
        localStorage.removeItem("cache");
        localStorage.setItem("cache", stringify({ account, providerName }));
      }
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
  };

  // Connect to safe if loaded in Gnosis.
  useEffect(() => {
    if (loadedAsSafeApp) {
      activateProvider("GnosisSafe");
    }
  }, [loadedAsSafeApp]);

  // handles setting localstorage wallet information to the state
  useEffect(() => {
    const cacheWallet = localStorage.getItem("cache") || null;
    if (cacheWallet) {
      const parseCacheWallet = parse(cacheWallet);
      setCachedWalletData(parseCacheWallet);
    }
  }, []);

  // Connect from cached provider info.
  useEffect(() => {
    if (!isEmpty(cachedWalletData)) {
      const { providerName } = cachedWalletData;
      if (providerName === "Injected" || providerName === "WalletConnect") {
        activateProvider(providerName);
      }
    } else {
      setWeb3();
    }
  }, [cachedWalletData]);

  // provider is connected, this stops the loader modal
  // and sets up connected state
  useEffect(() => {
    if (account && activeProvider) {
      dispatch(setConnecting());
      setWeb3().then(() => {
        dispatch(setConnected());
        setWalletConnecting(false);
        setShowSuccessModal(true);
      });
    }
  }, [account, activeProvider]);

  // provider events
  // allows us to listed for account and chain changes
  useEffect(() => {
    if (activeProvider?.on) {
      const handleAccountsChanged = async () => {
        const address = await getProviderAccount(activeProvider);
        setAccount(address);
      };

      const handleChainChanged = () => {
        getCurrentEthNetwork();
      };

      const handleDisconnect = () => {
        dispatch(setDisConnected());
      };

      activeProvider.on("accountsChanged", handleAccountsChanged);
      activeProvider.on("chainChanged", handleChainChanged);
      activeProvider.on("disconnect", handleDisconnect);

      // Subscription Cleanup
      return () => {
        if (activeProvider.removeListener) {
          activeProvider.removeListener(
            "accountsChanged",
            handleAccountsChanged,
          );
          activeProvider.removeListener("chainChanged", handleChainChanged);
          activeProvider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [activeProvider]);

  /*
   * We plug the initial `provider` into ethers.js and get back
   * a Web3Provider. This will add on methods from ethers.js and
   * event listeners such as `.on()` will be different.
   * It also makes it easier to immediately get the connected account.
   */
  const getProviderAccount = async (provider) => {
    const web3Provider = new providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    return await signer.getAddress();
  };

  /**
   * This activate any provide passed to the function where
   * provider can be injected provider, walletConnect or gnosis wallet provider
   * @param {*} provider
   */
  const activateProvider = async (providerName) => {
    dispatch(setConnectedProviderName(providerName));
    setProviderName(providerName);

    let provider;
    if (providerName === "GnosisSafe") {
      provider = await web3Modal.requestProvider();
    } else {
      // connect to selected providers
      provider = await web3Modal.connectTo(providerName.toLowerCase());
    }

    // This fixes issue with walletConnect transactions not receiving events.
    if (providerName === "WalletConnect") {
      delete provider.__proto__.request;
      provider.hasOwnProperty("request") && delete provider.request;
    }

    const address = await getProviderAccount(provider);
    setAccount(address);

    const newWeb3 = new Web3(provider);
    // hot fix
    // increase default timeout to 48hrs (172800 seconds)
    // this stops transactions from being marked as failed on the UI while still pending on-chain.
    newWeb3.eth.transactionPollingTimeout = 172800;
    await initializeWeb3(newWeb3);

    await setActiveProvider(provider);
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

  // always show the success modal for only 1 second
  useEffect(() => {
    if (showSuccessModal) {
      setTimeout(() => setShowSuccessModal(false), 1000);
    }
  }, [showSuccessModal]);

  // we'll check for the correct network using the debug setting from the .env file
  // if debug is set to true, the application has to be on the rinkeby network.
  // otherwise it has to be connected to mainnet.
  useEffect(() => {
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
          setWalletConnecting(false);
          setShowSuccessModal(true);
        }
      }
    }
  }, [currentEthereumNetwork]);

  // This handles the connect for a wallet
  const connectWallet = async (providerName) => {
    closeWalletModal();
    setWalletConnecting(true);

    try {
      if (
        providerName === "Injected" ||
        providerName === "WalletConnect" ||
        providerName === "GnosisSafe"
      ) {
        await activateProvider(providerName);
      }

      setWalletConnecting(false);
      setShowSuccessModal(true);
      if (router.pathname === "/clubs/create/clubprivatebetainvite") {
        amplitudeLogger(SUCCESSFUL_WALLET_CONNECT, {
          flow: Flow.WALLET_CONNECT,
        });
      }
    } catch (error) {
      const customError = getErrorMessage();
      setWalletConnecting(false);
      setShowSuccessModal(false);
      dispatch(showErrorModal(customError));
      amplitudeLogger(ERROR_WALLET_CONNECTION, {
        flow: Flow.WALLET_CONNECT,
        error,
      });
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
    await disconnect();
    dispatch(logout());
    localStorage.removeItem("cache");
    localStorage.removeItem("walletconnect");
  };

  const disconnect = async () => {
    await web3Modal.clearCachedProvider();
    dispatch(setDisConnected());
    setWalletConnecting(false);
    setShowSuccessModal(false);
    setAccount("");
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
        loadedAsSafeApp,
      }}
    >
      {children}
    </ConnectWalletContext.Provider>
  );
};

export default ConnectWalletProvider;
