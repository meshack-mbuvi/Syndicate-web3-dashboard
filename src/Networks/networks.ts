export interface INetwork {
  name: string;
  displayName: string;
  shortName: string;
  network: string;
  testnet: boolean;
  chainId: number;
  networkId: number;
  testNetwork: boolean;
  rpcUrl: string;
  publicRPC: string;
  logo: string;
  blockExplorer: {
    name: string;
    baseUrl: string;
    api: string;
    resources: {
      transaction: string;
      address: string;
    };
  };
  nativeCurrency: {
    symbol: string;
    name: string;
    decimals: string;
    exchangeRate: number;
    logo: string;
  };
  gnosis: {
    txServiceUrl: string;
  };
  metadata: {
    colors: {
      background: string;
    };
  };
}

export const NETWORKS: { [key: number]: INetwork } = Object.freeze({
  1: {
    name: 'Ethereum Mainnet',
    displayName: 'Ethereum',
    shortName: 'eth',
    network: 'mainnet',
    testnet: false,
    chainId: 1,
    networkId: 1,
    testNetwork: false,
    rpcUrl: process.env.NEXT_PUBLIC_ALCHEMY_MAINNET || '',
    publicRPC: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    logo: '/images/chains/ethereum.svg',
    blockExplorer: {
      name: 'Etherscan',
      baseUrl: 'https://etherscan.io',
      api: 'https://api.etherscan.io',
      resources: {
        transaction: 'tx',
        address: 'address'
      }
    },
    nativeCurrency: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: '18',
      exchangeRate: 10000,
      logo: '/images/ethereum-logo.svg'
    },
    gnosis: {
      txServiceUrl: 'https://safe-transaction.gnosis.io/api/v1/'
    },
    metadata: {
      colors: {
        background: 'blue-cornflowerBlue'
      }
    }
  },

  5: {
    name: 'Ethereum Goerli',
    displayName: 'Goerli',
    shortName: 'eth',
    network: 'goerli',
    testnet: true,
    chainId: 5,
    networkId: 5,
    testNetwork: true,
    rpcUrl: process.env.NEXT_PUBLIC_ALCHEMY_GOERLI || '',
    publicRPC: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    logo: '/images/chains/goerli.svg',
    blockExplorer: {
      name: 'Etherscan',
      baseUrl: 'https://goerli.etherscan.io',
      api: 'https://api-goerli.etherscan.io/',
      resources: {
        transaction: 'tx',
        address: 'address'
      }
    },
    nativeCurrency: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: '18',
      exchangeRate: 10000,
      logo: '/images/chains/goerli.svg'
    },
    gnosis: {
      txServiceUrl: 'https://safe-transaction.goerli.gnosis.io/api/v1'
    },
    metadata: {
      colors: {
        background: 'blue-liquidity'
      }
    }
  },

  137: {
    name: 'Polygon',
    displayName: 'Polygon',
    shortName: 'MATIC',
    network: 'polygon',
    testnet: false,
    chainId: 137,
    networkId: 137,
    testNetwork: false,
    rpcUrl: process.env.NEXT_PUBLIC_ALCHEMY_POLYGON || '',
    publicRPC: 'https://polygon-rpc.com/',
    logo: '/images/chains/polygon.svg',
    blockExplorer: {
      name: 'Polygonscan',
      baseUrl: 'https://polygonscan.com',
      api: 'https://api.polygonscan.com',
      resources: {
        transaction: 'tx',
        address: 'address'
      }
    },
    nativeCurrency: {
      symbol: 'MATIC',
      name: 'Polygon',
      decimals: '18',
      exchangeRate: 10,
      logo: '/images/chains/polygon.svg'
    },
    gnosis: {
      txServiceUrl: 'https://safe-transaction.polygon.gnosis.io/api/v1/'
    },
    metadata: {
      colors: {
        background: 'blue-blueViolet'
      }
    }
  }
});
