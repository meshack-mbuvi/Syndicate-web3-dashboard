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
import { isDev, isProd, isSSR } from "@/utils/environment";
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
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";
import { NETWORKS } from '@/Networks';
import { IActiveNetwork } from '@/state/wallet/types';

type AuthProviderProps = {
  connectWallet: (providerName: string) => void;
  activeNetwork: any;
  chainToken: string;
  showSuccessModal: boolean;
  walletConnecting: boolean;
  providerName: string;
  setWalletConnecting: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
  cancelWalletConnection: () => void;
  disconnectWallet: () => void;
  switchNetworks: (_chainId: number) => void;
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

const web3Modal: SafeAppWeb3Modal = isSSR()
  ? null
  : new SafeAppWeb3Modal({
      cacheProvider: true,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            rpc: {
              1: `${NETWORKS[1].rpcUrl}`,
              4: `${NETWORKS[4].rpcUrl}`,
              137: `${NETWORKS[137].rpcUrl}`,
            },
          },
        },
      },
    });

const ConnectWalletProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {
    web3Reducer: {
      web3: { currentEthereumNetwork },
    },
  } = useSelector((state: AppState) => state);

  // control whether to show success connection modal or not
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [walletConnecting, setWalletConnecting] = useState(false);
  const [cachedWalletData, setCachedWalletData] = useState(null);
  const [providerName, setProviderName] = useState("");
  const [chainId, setChainId] = useState(null);
  const [activeProvider, setActiveProvider] = useState(null);
  const [account, setAccount] = useState("");
  const [loadedAsSafeApp, setLoadedAsSafeApp] = useState(false);
  const [web3, setWeb3] = useState(new Web3(`${NETWORKS[1].rpcUrl}`)); // Default to an Ethereum mainnet

  const dispatch = useDispatch();

  const activeNetwork: IActiveNetwork = useMemo(
    () => NETWORKS[chainId] ?? NETWORKS[1],
    [chainId],
  );

  /*
   * Allows running as a gnosis safe app
   * This checks and connects automatially in gnosis safe.
   * Needs `public/manifest.json` to work.
   */
  useEffect(() => {
    web3Modal?.isSafeApp()?.then((isSafeApp) => {
      setLoadedAsSafeApp(isSafeApp);
      if (isSafeApp) {
        activateProvider("GnosisSafe");
      }
    });
  }, [web3Modal]);

  /**
   * Instantiates contract, and adds it together with web3 provider details to
   * store
   */
  const initializeWeb3 = async () => {
    // initialize contract now
    const contracts = await getSyndicateContracts(web3, activeNetwork);

    dispatch(setContracts(contracts));
    try {
      dispatch(hideErrorModal());
      if (account && activeProvider && chainId) {
        localStorage.removeItem("cache");
        localStorage.setItem(
          "cache",
          stringify({ account, providerName, chainId }),
        );
      }
      if (account) {
        return dispatch(
          setLibrary({
            account,
            web3,
            providerName,
            activeNetwork,
          }),
        );
      } else {
        return dispatch(
          setLibrary({
            account,
            web3: web3,
            providerName,
            activeNetwork,
          }),
        );
      }
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

  // handles setting localstorage wallet information to the state
  useEffect(() => {
    const cacheWallet = localStorage.getItem("cache") || null;
    if (cacheWallet) {
      const parseCacheWallet = parse(cacheWallet);
      setCachedWalletData(parseCacheWallet);
    } else {
      initializeWeb3();
    }
  }, []);

  // Connect from cached provider info.
  useEffect(() => {
    if (!isEmpty(cachedWalletData)) {
      const { providerName, chainId } = cachedWalletData;
      if (providerName === "Injected" || providerName === "WalletConnect") {
        activateProvider(providerName);
        setChainId(chainId);
      }
    }
  }, [cachedWalletData]);

  // provider is connected, this stops the loader modal
  // and sets up connected state
  useEffect(() => {
    if (account && activeProvider && activeNetwork) {
      dispatch(setConnecting());
      initializeWeb3().then(() => {
        dispatch(setConnected());
        setWalletConnecting(false);
        setShowSuccessModal(true);
      });
    } else if (activeNetwork && !account) {
      initializeWeb3();
    }
  }, [account, activeProvider, activeNetwork]);

  // provider events
  // allows us to listed for account and chain changes
  useEffect(() => {
    if (activeProvider?.on) {
      const handleAccountsChanged = async () => {
        const { address } = await getProviderAccountAndNetwork(activeProvider);
        setAccount(address);
      };

      const handleChainChanged = async () => {
        getCurrentEthNetwork();
        const { network } = await getProviderAccountAndNetwork(activeProvider);
        setChainId(network.chainId);
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
   * It also makes it easier to immediately get the connected account,
   * and the networkID.
   */
  const getProviderAccountAndNetwork = async (provider) => {
    const p = new providers.Web3Provider(provider);
    const [address, network] = await Promise.all([
      p.getSigner().getAddress(),
      p.getNetwork(),
    ]);
    return { address, network };
  };

  /**
   * This activate any provide passed to the function where
   * provider can be injected provider, walletConnect or gnosis wallet provider
   * @param {*} provider
   */
  const activateProvider = async (providerName: string) => {
    dispatch(setConnectedProviderName(providerName));
    setProviderName(providerName);

    const provider = await (providerName === "GnosisSafe"
      ? web3Modal.requestProvider()
      : web3Modal.connectTo(providerName.toLowerCase()));

    // This fixes issue with walletConnect transactions not receiving events.
    if (providerName === "WalletConnect") {
      delete provider.__proto__.request;
      // eslint-disable-next-line no-prototype-builtins
      if (provider.hasOwnProperty("request")) {
        delete provider.request;
      }
    }

    const { address, network } = await getProviderAccountAndNetwork(provider);
    setAccount(address);

    const newWeb3 = new Web3(provider);
    // hot fix
    // increase default timeout to 48hrs (172800 seconds)
    // this stops transactions from being marked as failed on the UI while still pending on-chain.
    newWeb3.eth.transactionPollingTimeout = 172800;

    setWeb3(newWeb3);
    setActiveProvider(provider);
    setChainId(Number(network.chainId));
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

  const switchNetworks = async (_chainId) => {
    if (account) {
      try {
        /*
      TODO: walletConnect variant for wallet switching
            https://github.com/gnosis/safe-react/blob/aad9469e33d3abc7cf0dd8e0e389029f8c9eaa4a/src/logic/wallets/utils/network.ts#L21
      */
        await activeProvider?.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: web3.utils.toHex(_chainId) }],
        });
      } catch (error) {
        if (error.code === 4902) {
          try {
            const activeNetwork = NETWORKS[_chainId];
            await activeProvider?.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: web3.utils.toHex(activeNetwork.chainId),
                  chainName: activeNetwork.name,
                  rpcUrls: [activeNetwork.publicRPC], // use public rpc here -> this is visible to the user on metamask
                  nativeCurrency: {
                    name: activeNetwork.nativeCurrency.name,
                    symbol: activeNetwork.nativeCurrency.symbol,
                    decimals: +activeNetwork.nativeCurrency.decimals,
                  },
                  blockExplorerUrls: [activeNetwork.blockExplorer.baseUrl],
                },
              ],
            });
          } catch (error) {
            console.log(error.message);
          }
        }
      }
    } else {
      setChainId(_chainId);
      setWeb3(new Web3(`${NETWORKS[_chainId].rpcUrl}`));
    }
  };

  useEffect(() => {
    // check current network type
    getCurrentEthNetwork();
  }, [currentEthereumNetwork]);

  // always show the success modal for only 1 second
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => setShowSuccessModal(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  // we'll check for the correct network using the debug setting from the .env file
  // if debug is set to true, the application has to be on the rinkeby network.
  // otherwise it has to be connected to mainnet.
  useEffect(() => {
    if (chainId && providerName === "Injected") {
      // --------- changed this for easy testing -------------
      // if ((isDev && chainId === 4) || (isProd && [1, 137].includes(chainId))) {
      if ([1, 4, 137].includes(chainId)) {
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
      } else {
        dispatch(
          storeEthereumNetwork({
            invalidEthereumNetwork: true,
            correctEthereumNetwork: "mainnet or matic",
          }),
        );
      }
    }
  }, [chainId]);

  // This handles the connect for a wallet
  const connectWallet = async (providerName: string) => {
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
    } finally {
      setWalletConnecting(false);
      closeWalletModal();
    }
  };

  const cancelWalletConnection = async () => {
    // set the wallet connection status to disconnected; this stops
    // the loader modal
    dispatch(setDisConnected());
    setWalletConnecting(false);
  };

  // Logout section. Handles disconnecting and deletes cache
  const disconnectWallet = () => {
    web3Modal.clearCachedProvider();

    dispatch(setDisConnected());

    setWalletConnecting(false);
    setShowSuccessModal(false);
    setAccount("");
    dispatch(logout());
    localStorage.removeItem("cache");
    localStorage.removeItem("walletconnect");
  };

  return (
    <ConnectWalletContext.Provider
      value={{
        connectWallet,
        activeNetwork,
        walletConnecting,
        showSuccessModal,
        providerName,
        setWalletConnecting,
        setShowSuccessModal,
        cancelWalletConnection,
        disconnectWallet,
        switchNetworks,
        loadedAsSafeApp,
      }}
    >
      {children}
    </ConnectWalletContext.Provider>
  );
};

export default ConnectWalletProvider;
