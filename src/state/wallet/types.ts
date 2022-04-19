import Web3 from 'web3';

const initialWeb3 = new Web3(process.env.NEXT_PUBLIC_ALCHEMY);

export interface IWeb3 extends Web3 {
  _provider?: any;
  utils: any;
}

export interface IWeb3Library {
  account: string;
  web3: IWeb3;
  providerName: string;
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

export interface InitialState {
  web3: {
    status: Status;
    connect: boolean;
    showConnectionModal: boolean;
    isErrorModalOpen: boolean;
    error: IModalErrors | any;
    web3: IWeb3;
    account: string;
    providerName: string;
    currentEthereumNetwork: string;
    ethereumNetwork: {
      correctEthereumNetwork: string;
      invalidEthereumNetwork: boolean;
    };
  };
  showWalletModal: boolean;
  dispatchCreateFlow: boolean;
}

export const initialState: InitialState = {
  web3: {
    status: Status.DISCONNECTED,
    connect: false,
    showConnectionModal: false,
    isErrorModalOpen: false,
    error: null,
    web3: initialWeb3,
    account: '',
    providerName: '',
    currentEthereumNetwork: '',
    ethereumNetwork: {
      correctEthereumNetwork: '',
      invalidEthereumNetwork: false
    }
  },
  showWalletModal: false,
  dispatchCreateFlow: false
};
