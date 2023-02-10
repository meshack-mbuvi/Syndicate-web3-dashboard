import { Web3Provider } from '@ethersproject/providers';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { Eth } from 'web3-eth';
import { Utils } from 'web3-utils';

export interface IWeb3 extends Web3 {
  _provider?: any;
  utils: Utils & {
    BN?: typeof BigNumber;
  };
  eth: Eth;
}
export interface IGnosis {
  txServiceUrl: string;
}

export interface IBlockResources {
  transaction: string;
  address: string;
}
export interface IblockExplorer {
  name: string;
  baseUrl: string;
  api: string;
  resources: IBlockResources;
}

export interface INativeCurrency {
  symbol: string;
  name: string;
  decimals: string;
  exchangeRate: number;
  logo: string;
}

export interface IMetadata {
  colors: {
    background: string;
  };
}

export interface IActiveNetwork {
  name: string;
  displayName: string;
  shortName: string;
  network: string;
  testnet: boolean;
  chainId: number;
  networkId: number | null;
  rpcUrl: string;
  publicRPC: string;
  logo: string;
  blockExplorer: IblockExplorer;
  nativeCurrency: INativeCurrency;
  gnosis: IGnosis;
  metadata: IMetadata;
}

export interface IWeb3Library {
  account: string;
  web3: IWeb3;
  providerName: string;
  activeNetwork: IActiveNetwork;
  ethersProvider: Web3Provider | null;
}

export interface IEthereumNetwork {
  invalidEthereumNetwork: boolean;
  correctEthereumNetwork: string;
}

export interface IModalErrors {
  title?: string;
  message: string;
  type: string;
}

export enum Status {
  CONNECTED = 'connected',
  CONNECTING = 'connecting',
  DISCONNECTED = 'disconnected'
}

export interface IWeb3State {
  status: Status;
  connect: boolean;
  showConnectionModal: boolean;
  isErrorModalOpen: boolean;
  error: IModalErrors | any;
  web3: IWeb3 | null;
  chainId: number;
  account: string;
  providerName: string;
  activeNetwork: IActiveNetwork;
  currentEthereumNetwork: string;
  ethereumNetwork: {
    correctEthereumNetwork: string;
    invalidEthereumNetwork: boolean;
  };
  ethersProvider: Web3Provider | null;
}

export interface InitialState {
  web3: IWeb3State;
  showWalletModal: boolean;
  dispatchCreateFlow: boolean;
  showNetworkDropdown: boolean;
  showWalletDropdown: boolean;
}

export const initialState: InitialState = {
  web3: {
    status: Status.DISCONNECTED,
    connect: false,
    ethersProvider: null,
    showConnectionModal: false,
    isErrorModalOpen: false,
    error: null,
    web3: null,
    account: '',
    chainId: 0,
    providerName: '',
    currentEthereumNetwork: '',
    ethereumNetwork: {
      correctEthereumNetwork: '',
      invalidEthereumNetwork: false
    },
    activeNetwork: {
      name: '',
      displayName: '',
      shortName: '',
      network: '',
      testnet: false,
      chainId: 0,
      networkId: null,
      rpcUrl: '',
      publicRPC: '',
      logo: '',
      blockExplorer: {
        name: '',
        baseUrl: '',
        api: '',
        resources: {
          transaction: '',
          address: ''
        }
      },
      nativeCurrency: {
        symbol: '',
        name: '',
        decimals: '',
        exchangeRate: 1,
        logo: ''
      },
      gnosis: {
        txServiceUrl: ''
      },
      metadata: {
        colors: {
          background: ''
        }
      }
    }
  },
  showWalletModal: false,
  dispatchCreateFlow: false,
  showNetworkDropdown: false,
  showWalletDropdown: false
};
