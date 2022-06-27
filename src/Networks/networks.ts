export const NETWORKS = Object.freeze({
  1: {
    name: 'Ethereum Mainnet',
    displayName: 'Ethereum',
    shortName: 'eth',
    network: 'mainnet',
    testnet: false,
    chainId: 1,
    networkId: 1,
    testNetwork: false,
    rpcUrl: process.env.NEXT_PUBLIC_ALCHEMY_MAINNET,
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
      exchangeRate: 10000
    },
    gnosis: {
      txServiceUrl: 'https://safe-transaction.gnosis.io/api/v1/'
    },
    metadata: {
      colors: {
        background: 'blue-cornflowerBlue'
      }
    },
    demoMode: {
      usdPrice: 2396.93
    }
  },

  4: {
    name: 'Ethereum Rinkeby',
    displayName: 'Rinkeby',
    shortName: 'rin',
    network: 'rinkeby',
    testnet: true,
    chainId: 4,
    networkId: 4,
    testNetwork: true,
    rpcUrl: process.env.NEXT_PUBLIC_ALCHEMY_RINKEBY,
    publicRPC: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    logo: '/images/chains/rinkeby.svg',
    blockExplorer: {
      name: 'Etherscan',
      baseUrl: 'https://rinkeby.etherscan.io',
      api: 'https://api-rinkeby.etherscan.io/',
      resources: {
        transaction: 'tx',
        address: 'address'
      }
    },
    nativeCurrency: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: '18',
      exchangeRate: 10000
    },
    gnosis: {
      txServiceUrl: 'https://safe-transaction.rinkeby.gnosis.io/api/v1/'
    },
    metadata: {
      colors: {
        background: 'orange-light'
      }
    },
    demoMode: {
      usdPrice: 1193.46
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
    rpcUrl: process.env.NEXT_PUBLIC_ALCHEMY_POLYGON,
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
      exchangeRate: 10
    },
    gnosis: {
      txServiceUrl: 'https://safe-transaction.polygon.gnosis.io/api/v1/'
    },
    metadata: {
      colors: {
        background: 'blue-blueViolet'
      }
    },
    demoMode: {
      usdPrice: 0.529429
    }
  }
});
