export const BACKEND_LINKS = Object.freeze({
  // Ethereum Mainnet
  1: {
    graphs: {
      backend: process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_ENDPOINT,
      theGraph: process.env.NEXT_PUBLIC_GRAPHQL_MAINNET_ENDPOINT
    },
    apiServer: process.env.NEXT_PUBLIC_API_SERVER_URL
  },
  // Rinkeby
  4: {
    graphs: {
      backend: process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_ENDPOINT,
      theGraph: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT
    },
    apiServer: process.env.NEXT_PUBLIC_API_SERVER_URL
  },
  // Goerli
  5: {
    graphs: {
      backend: process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_ENDPOINT,
      theGraph: process.env.NEXT_PUBLIC_GRAPHQL_GOERLI_ENDPOINT
    },
    apiServer: process.env.NEXT_PUBLIC_API_SERVER_URL
  },
  // Matic
  137: {
    graphs: {
      backend: process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_ENDPOINT,
      theGraph: process.env.NEXT_PUBLIC_GRAPHQL_MATIC_ENDPOINT
    },
    apiServer: process.env.NEXT_PUBLIC_API_SERVER_URL
  }
});
