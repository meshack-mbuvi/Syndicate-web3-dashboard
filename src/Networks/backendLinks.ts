export const BACKEND_LINKS = Object.freeze({
  // Ethereum Mainnet
  1: {
    graphs: {
      backend: process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_ENDPOINT_PROD,
      theGraph: process.env.NEXT_PUBLIC_GRAPHQL_MAINNET_ENDPOINT,
    },
    apiServer: process.env.NEXT_PUBLIC_API_SERVER_URL,
  },
  // Rinkeby
  4: {
    graphs: {
      backend: process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_ENDPOINT_STAGING,
      theGraph: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
    },
    apiServer: process.env.NEXT_PUBLIC_API_SERVER_URL,
  },
  // Matic
  137: {
    graphs: {
      backend: process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_ENDPOINT_MATIC,
      theGraph: process.env.NEXT_PUBLIC_GRAPHQL_MATIC_ENDPOINT,
    },
    apiServer: process.env.NEXT_PUBLIC_API_SERVER_URL,
  },
});
