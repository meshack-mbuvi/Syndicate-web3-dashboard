export const BACKEND_LINKS = Object.freeze({
  // Ethereum Mainnet
  1: {
    graphs: {
      backend: process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_ENDPOINT,
      theGraph: process.env.NEXT_PUBLIC_SATSUMA_MAINNET_ENDPOINT
    },
    apiServer: process.env.NEXT_PUBLIC_API_SERVER_URL
  },
  // Rinkeby
  // rinkeby not updated with satsuma because it will be sunset
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
      theGraph: process.env.NEXT_PUBLIC_SATSUMA_GOERLI_ENDPOINT
    },
    apiServer: process.env.NEXT_PUBLIC_API_SERVER_URL
  },
  // Matic
  137: {
    graphs: {
      backend: process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_ENDPOINT,
      theGraph: process.env.NEXT_PUBLIC_SATSUMA_MATIC_ENDPOINT
    },
    apiServer: process.env.NEXT_PUBLIC_API_SERVER_URL
  }
});
