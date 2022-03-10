export const NETWORKS = Object.freeze({
  1: {
    name: "Ethereum Mainnet",
    displayName: "Ethereum",
    shortName: "eth",
    network: "mainnet",
    chainId: 1,
    networkId: 1,
    testNetwork: false,
    rpcUrl: process.env.NEXT_PUBLIC_ALCHEMY_MAINNET,
    publicRPC: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    logo: "/images/chains/ethereum.svg",
    blockExplorer: {
      name: "Etherscan",
      baseUrl: "https://etherscan.io",
      api: "https://api.etherscan.io",
      resources: {
        transaction: "tx",
        address: "address",
      },
    },
    nativeCurrency: {
      symbol: "ETH",
      name: "Ethereum",
      decimals: "18",
    },
    metadata: {
      colors: {
        background: "blue-cornflowerBlue",
      },
    },
  },

  4: {
    name: "Ethereum Rinkeby",
    displayName: "Rinkeby",
    shortName: "eth",
    network: "rinkeby",
    chainId: 4,
    networkId: 4,
    testNetwork: true,
    rpcUrl: process.env.NEXT_PUBLIC_ALCHEMY_RINKEBY,
    publicRPC: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    logo: "/images/chains/rinkeby.svg",
    blockExplorer: {
      name: "Etherscan",
      baseUrl: "https://rinkeby.etherscan.io",
      api: "https://rinkeby.etherscan.io",
      resources: {
        transaction: "tx",
        address: "address",
      },
    },
    nativeCurrency: {
      symbol: "ETH",
      name: "Ethereum",
      decimals: "18",
    },
    metadata: {
      colors: {
        background: "orange-light",
      },
    },
  },

  137: {
    name: "Polygon",
    displayName: "Polygon",
    shortName: "eth",
    network: "polygon",
    chainId: 137,
    networkId: 137,
    testNetwork: false,
    rpcUrl: process.env.NEXT_PUBLIC_ALCHMEY_MATIC,
    publicRPC:
      "https://polygon-mainnet.infura.io/v3/295cce92179b4be498665b1b16dfee34",
    logo: "/images/chains/polygon.svg",
    blockExplorer: {
      name: "Polygonscan",
      baseUrl: "https://polygonscan.com",
      api: "https://api.polygonscan.com",
      resources: {
        transaction: "tx",
        address: "address",
      },
    },
    nativeCurrency: {
      symbol: "MATIC",
      name: "Polygon",
      decimals: "18",
    },
    metadata: {
      colors: {
        background: "blue-blueViolet",
      },
    },
  },
});
