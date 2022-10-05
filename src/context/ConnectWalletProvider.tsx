/* eslint-disable react-hooks/exhaustive-deps */
import { getSyndicateContracts } from '@/ClubERC20Factory';
import { amplitudeLogger, Flow } from '@/components/amplitude';
import { WALLET_CONNECTION } from '@/components/amplitude/eventNames';
import { web3InstantiationErrorText } from '@/components/syndicates/shared/Constants';
import { NETWORKS } from '@/Networks';
import { AppState } from '@/state';
import { setContracts } from '@/state/contracts';
import { setCurrentClient } from '@/state/featureFlagClient/slice';
import {
  hideErrorModal,
  hideWalletModal,
  logout,
  setConnected,
  setConnectedProviderName,
  setConnecting,
  setDisConnected,
  setLibrary,
  setShowNetworkDropdownMenu,
  setShowWalletDropdownMenu,
  showErrorModal,
  showWalletModal,
  storeCurrentEthNetwork,
  storeEthereumNetwork
} from '@/state/wallet/actions';
import { IActiveNetwork } from '@/state/wallet/types';
import { isSSR } from '@/utils/environment';
import { Web3Provider } from '@ethersproject/providers';
import { SafeAppWeb3Modal } from '@gnosis.pm/safe-apps-web3modal';
import { useClient } from '@splitsoftware/splitio-react';
import WalletConnectProvider from '@walletconnect/web3-provider';
import amplitude from 'amplitude-js';
import { providers } from 'ethers';
import { parse, stringify } from 'flatted';
import { isEmpty } from 'lodash';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Web3 from 'web3';

type AuthProviderProps = {
  connectWallet: (providerName: string, walletName?: string) => void;
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
    title: 'Connection unsuccessful',
    message: 'Please authorize this website to access your Ethereum account.',
    type: 'generalError'
  };
};

const getWalletconnectRPCs = () => {
  const links = {};
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  Object.entries(NETWORKS).map(([key, value]) => (links[key] = value.rpcUrl));
  return links;
};
const walletconnectRPCs = Object.freeze(getWalletconnectRPCs());

// @ts-expect-error TS(2322): Type 'SafeAppWeb3Modal | null' is not assignable t... Remove this comment to see the full error message
const web3Modal: SafeAppWeb3Modal = isSSR()
  ? null
  : new SafeAppWeb3Modal({
      cacheProvider: true,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            rpc: walletconnectRPCs
          }
        }
      }
    });

const ConnectWalletProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const {
    web3Reducer: {
      web3: { currentEthereumNetwork }
    }
  } = useSelector((state: AppState) => state);

  // control whether to show success connection modal or not
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [walletConnecting, setWalletConnecting] = useState(false);
  const [cachedWalletData, setCachedWalletData] = useState(null);
  const [providerName, setProviderName] = useState('');
  const [chainId, setChainId] = useState(null);
  const [activeProvider, setActiveProvider] = useState(null);
  // @ts-expect-error TS(2345): Argument of type 'null' is not assignable to parameter of type 'Web3Provider | (() => Web3Provider)'... Remove this comment to see the full error message
  const [ethersProvider, setEthersProvider] = useState<Web3Provider>(null);

  const [account, setAccount] = useState('');
  const [loadedAsSafeApp, setLoadedAsSafeApp] = useState(false);
  const [web3, setWeb3] = useState<Web3>(new Web3(`${NETWORKS[1].rpcUrl}`)); // Default to an Ethereum mainnet
  const [loading, setLoading] = useState<boolean>(true);

  const dispatch = useDispatch();

  // Initiates current client for feature flags
  const currentClient = useClient(account ? account : 'user', 'user');

  // When Split SDK is ready, set attributes to current client and mark it as ready
  useEffect(() => {
    currentClient?.on(currentClient.Event.SDK_READY, () => {
      dispatch(setCurrentClient(currentClient));
    });
  }, [currentClient]);

  const activeNetwork: IActiveNetwork = useMemo(
    // @ts-expect-error TS(2538): Type 'null' cannot be used as an index type.
    () => NETWORKS[chainId] ?? NETWORKS[1],
    [chainId]
  );

  const detachedWeb3 = useMemo(() => {
    if (chainId) {
      // @ts-expect-error TS(2339): Property 'rpcUrl' does not exist on type 'never'.
      const rpcUrl = NETWORKS[chainId]?.rpcUrl;
      if (rpcUrl) return new Web3(`${rpcUrl}`);

      return;
    }
    return new Web3(`${NETWORKS[1].rpcUrl}`);
  }, [chainId]);

  const supportedNetworks: number[] = useMemo(() => {
    return Object.keys(NETWORKS).map((key) => {
      return Number(key);
    });
  }, [NETWORKS]);

  /*
   * Allows running as a gnosis safe app
   * This checks and connects automatically in gnosis safe.
   * Needs `public/manifest.json` to work.
   */
  useEffect(() => {
    web3Modal?.isSafeApp()?.then((isSafeApp) => {
      setLoadedAsSafeApp(isSafeApp);
      if (isSafeApp) {
        activateProvider('GnosisSafe');
      }
    });
  }, [web3Modal]);

  useEffect(() => {
    if (account) {
      amplitudeLogger(WALLET_CONNECTION, {
        flow: Flow.WEB_APP,
        transaction_status: 'Success',
        wallet_address: account,
        wallet_network: activeNetwork.displayName
      });

      const wallet_address = new amplitude.Identify().set(
        'wallet_address',
        account
      );
      const wallet_network = new amplitude.Identify().set(
        'wallet_network',
        activeNetwork.displayName
      );
      amplitude.getInstance().identify(wallet_address);
      amplitude.getInstance().identify(wallet_network);
    }
  }, [account]);

  /**
   * Instantiates contract, and adds it together with web3 provider details to
   * store
   */
  const initializeWeb3 = async (): Promise<void> => {
    try {
      // initialize contract now
      const contracts = await getSyndicateContracts(web3, activeNetwork);

      dispatch(setContracts(contracts));
      dispatch(hideErrorModal());
      if (account || activeProvider || chainId) {
        localStorage.removeItem('cache');
        localStorage.setItem(
          'cache',
          stringify({ account, providerName, chainId })
        );
      }
      if (account) {
        dispatch(
          setLibrary({
            account,
            web3: web3,
            providerName,
            activeNetwork,
            ethersProvider
          })
        );
      } else {
        dispatch(
          setLibrary({
            account,
            // @ts-expect-error TS(2322): Type 'Web3 | undefined' is not assignable to type 'IWeb3'.
            web3: detachedWeb3,
            providerName,
            activeNetwork,
            ethersProvider
          })
        );
      }
    } catch (error) {
      dispatch(setDisConnected());
      dispatch(
        showErrorModal({
          message: web3InstantiationErrorText,
          type: 'web3InstantionError'
        })
      );
    }
  };

  // handles setting localstorage wallet information to the state
  useEffect(() => {
    const cacheWallet = localStorage.getItem('cache') || null;
    if (cacheWallet) {
      const parseCacheWallet = parse(cacheWallet);
      setCachedWalletData(parseCacheWallet);
    } else {
      setLoading(false);
      if (!chainId) {
        // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
        setChainId(activeNetwork.chainId);
      }
      initializeWeb3();
    }
  }, []);

  // Connect from cached provider info.
  useEffect(() => {
    if (!isEmpty(cachedWalletData)) {
      // @ts-expect-error TS(2339): Property 'providerName' does not exist on type 'nu... Remove this comment to see the full error message
      const { providerName, chainId } = cachedWalletData;
      if (providerName === 'Injected' || providerName === 'WalletConnect') {
        activateProvider(providerName);
        setChainId(chainId);
      } else if (chainId && !providerName && !account) {
        setChainId(chainId);
        setLoading(false);
        initializeWeb3();
      }
    }
  }, [cachedWalletData]);

  // provider is connected, this stops the loader modal
  // and sets up connected state
  useEffect(() => {
    try {
      if (!loading && account && activeProvider && activeNetwork) {
        dispatch(setConnecting());
        initializeWeb3()
          .then(() => {
            dispatch(setConnected());
            setWalletConnecting(false);
            setShowSuccessModal(true);
            dispatch(setShowNetworkDropdownMenu(false));
            dispatch(setShowWalletDropdownMenu(false));
          })
          .catch((error) => {
            console.log({ error });
          });
      } else if (!loading && activeNetwork && !account) {
        initializeWeb3();
      }
    } catch (error) {
      console.log({ error });
    }
  }, [loading, account, activeProvider, ethersProvider, activeNetwork]);

  // provider events
  // allows us to listed for account and chain changes
  // @ts-expect-error TS(7030): Not all code paths return a value.
  useEffect(() => {
    // @ts-expect-error TS(2339): Property 'on' does not exist on type 'never'.
    if (activeProvider?.on) {
      const handleAccountsChanged = async () => {
        const { address } = await getProviderAccountAndNetwork(activeProvider);
        setAccount(address);
      };

      const handleChainChanged = async () => {
        await getCurrentEthNetwork();
        await newWeb3Instance(activeProvider);
        const { network, ethersProvider } = await getProviderAccountAndNetwork(
          activeProvider
        );
        // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to para... Remove this comment to see the full error message
        setChainId(network.chainId);
        setEthersProvider(ethersProvider);
      };

      const handleDisconnect = () => {
        dispatch(setDisConnected());
      };

      // @ts-expect-error TS(2339): Property 'on' does not exist on type 'never'.
      activeProvider.on('accountsChanged', handleAccountsChanged);
      // @ts-expect-error TS(2339): Property 'on' does not exist on type 'never'.
      activeProvider.on('chainChanged', handleChainChanged);
      // @ts-expect-error TS(2339): Property 'on' does not exist on type 'never'.
      activeProvider.on('disconnect', handleDisconnect);

      // Subscription Cleanup
      return () => {
        // @ts-expect-error TS(2339): Property 'removeListener' does not exist on type '... Remove this comment to see the full error message
        if (activeProvider.removeListener) {
          // @ts-expect-error TS(2339): Property 'removeListener' does not exist on type '... Remove this comment to see the full error message
          activeProvider.removeListener(
            'accountsChanged',
            handleAccountsChanged
          );
          // @ts-expect-error TS(2339): Property 'removeListener' does not exist on type '... Remove this comment to see the full error message
          activeProvider.removeListener('chainChanged', handleChainChanged);
          // @ts-expect-error TS(2339): Property 'removeListener' does not exist on type '... Remove this comment to see the full error message
          activeProvider.removeListener('disconnect', handleDisconnect);
        }
      };
    }
  }, [activeProvider]);

  /*
   * We plug the initial `provider` into ethers.js and get back
   * a Web3Provider. This will add on methods from ethers.js and
   * event listeners such as `.on()` will be different.
   * It also makes it easier to immediately get the connected account,
   * and the networkID. This also lets us resolve ens names and avatars.
   */
  const getProviderAccountAndNetwork = async (provider: any) => {
    const ethersProvider = new providers.Web3Provider(provider);
    const [address, network] = await Promise.all([
      ethersProvider.getSigner().getAddress(),
      ethersProvider.getNetwork()
    ]).catch(() => []);
    // if (network.chainId == 1) {
    //   // ens only works for mainnet
    //   const ensName = await p.lookupAddress(address);
    //   if (!ensName) {
    //     return { address, network, ensResolver: null };
    //   }
    //   const ensResolver = await p.getResolver(ensName);
    //   return { address, network, ensResolver };
    // } else {
    //   return { address, network, ensResolver: null };
    // }
    return { address, network, ethersProvider };
  };

  const newWeb3Instance = async (provider: any) => {
    const newWeb3 = new Web3(provider);
    // hot fix
    // increase default timeout to 48hrs (172800 seconds)
    // this stops transactions from being marked as failed on the UI while still pending on-chain.
    newWeb3.eth.transactionPollingTimeout = 172800;

    setWeb3(newWeb3);
  };

  /**
   * This activate any provide passed to the function where
   * provider can be injected provider, walletConnect or gnosis wallet provider
   * @param {*} provider
   */
  const activateProvider = async (providerName: string) => {
    dispatch(setConnectedProviderName(providerName));
    setProviderName(providerName);

    const provider = await (providerName === 'GnosisSafe'
      ? web3Modal.requestProvider()
      : web3Modal.connectTo(providerName.toLowerCase()));

    // This fixes issue with walletConnect transactions not receiving events.
    if (providerName === 'WalletConnect') {
      delete provider.__proto__.request;
      // eslint-disable-next-line no-prototype-builtins
      if (provider.hasOwnProperty('request')) {
        delete provider.request;
      }
    }

    const { address, network, ethersProvider } =
      await getProviderAccountAndNetwork(provider);

    await newWeb3Instance(provider);

    setAccount(address);
    setEthersProvider(ethersProvider);
    setActiveProvider(provider);
    // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
    setChainId(Number(network.chainId));
    setLoading(false);
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
    try {
      const currentNetwork = await web3.eth.net.getNetworkType();
      dispatch(storeCurrentEthNetwork(currentNetwork));
    } catch (error) {
      console.log({ error });
    }
  };

  const switchNetworks = async (_chainId: any) => {
    if (account) {
      try {
        /*
      TODO: walletConnect variant for wallet switching
            https://github.com/gnosis/safe-react/blob/aad9469e33d3abc7cf0dd8e0e389029f8c9eaa4a/src/logic/wallets/utils/network.ts#L21
      */
        // @ts-expect-error TS(2339): Property 'request' does not exist on type 'never'.
        await activeProvider?.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: web3.utils.toHex(_chainId) }]
        });
      } catch (error) {
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        if (error.code === 4902) {
          try {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            const activeNetwork = NETWORKS[_chainId];
            // @ts-expect-error TS(2339): Property 'request' does not exist on type 'never'.
            await activeProvider?.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: web3.utils.toHex(activeNetwork.chainId),
                  chainName: activeNetwork.name,
                  rpcUrls: [activeNetwork.publicRPC], // use public rpc here -> this is visible to the user on metamask
                  nativeCurrency: {
                    name: activeNetwork.nativeCurrency.name,
                    symbol: activeNetwork.nativeCurrency.symbol,
                    decimals: +activeNetwork.nativeCurrency.decimals
                  },
                  blockExplorerUrls: [activeNetwork.blockExplorer.baseUrl]
                }
              ]
            });
          } catch (error) {
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            console.log(error.message);
          }
        }
      }
    } else {
      setChainId(_chainId);
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      setWeb3(new Web3(`${NETWORKS[_chainId].rpcUrl}`));
    }
  };

  useEffect(() => {
    // check current network type
    void getCurrentEthNetwork();
  }, [currentEthereumNetwork]);

  // always show the success modal for only 1 second
  // @ts-expect-error TS(7030): Not all code paths return a value.
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => setShowSuccessModal(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  // Checks if we are connected to the supported networks.
  useEffect(() => {
    if (chainId && providerName === 'Injected' && supportedNetworks.length) {
      if (supportedNetworks.includes(chainId)) {
        dispatch(
          storeEthereumNetwork({
            invalidEthereumNetwork: false,
            correctEthereumNetwork: ''
          })
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
            correctEthereumNetwork: `mainnet or polygon`
          })
        );
      }
    }
  }, [chainId, supportedNetworks]);

  // This handles the connect for a wallet
  const connectWallet = async (
    providerName: string,
    walletName?: string
  ): Promise<void> => {
    closeWalletModal();
    setWalletConnecting(true);

    let showWalletConnecting = false;
    let providerNotFound = false;
    let connectionRejected = false;

    try {
      if (
        providerName === 'Injected' ||
        providerName === 'WalletConnect' ||
        providerName === 'GnosisSafe'
      ) {
        await activateProvider(providerName);
      }

      setWalletConnecting(false);
      setShowSuccessModal(true);
    } catch (error) {
      if (
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        error.code === -32002 ||
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        error.message === 'Already processing eth_requestAccounts. Please wait.'
      ) {
        showWalletConnecting = true;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
      } else if (error.message === 'User Rejected') {
        connectionRejected = true;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
      } else if (error.message === 'No Web3 Provider found') {
        providerNotFound = true;
      } else {
        const customError = getErrorMessage();
        setWalletConnecting(false);
        setShowSuccessModal(false);
        dispatch(showErrorModal(customError));
        amplitudeLogger(WALLET_CONNECTION, {
          flow: Flow.WEB_APP,
          transaction_status: 'Failure'
        });
      }
    } finally {
      if (showWalletConnecting) {
        setWalletConnecting(true);
      } else if (connectionRejected) {
        setWalletConnecting(false);
        dispatch(showWalletModal());
      } else if (providerNotFound) {
        setWalletConnecting(false);
        dispatch(showWalletModal());

        switch (walletName) {
          case 'WalletConnect':
            window.open('https://metamask.io/download/', '_blank');
            break;

          case 'Coinbase Wallet':
            window.open(
              'https://www.coinbase.com/wallet/getting-started-extension',
              '_blank'
            );
            break;

          default:
            window.open('https://metamask.io/download/', '_blank');
            break;
        }
      } else {
        setWalletConnecting(false);
        closeWalletModal();
      }
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
    setProviderName('');
    dispatch(setDisConnected());
    setWalletConnecting(false);
    setShowSuccessModal(false);
    setAccount('');
    // @ts-expect-error TS(2345): Argument of type 'null' is not assignable to parameter of type 'SetStateAction<Web3Provider>
    setEthersProvider(null);
    dispatch(logout());
    localStorage.removeItem('cache');
    localStorage.removeItem('walletconnect');
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
        loadedAsSafeApp
      }}
    >
      {children}
    </ConnectWalletContext.Provider>
  );
};

export default ConnectWalletProvider;
