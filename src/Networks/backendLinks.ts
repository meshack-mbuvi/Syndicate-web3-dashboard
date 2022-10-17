import { HttpLink } from '@apollo/client';

export enum SUPPORTED_GRAPHS {
  BACKEND = 'backend',
  THE_GRAPH = 'theGraph'
}

export type GraphLinks = {
  [key: string]: Record<SUPPORTED_GRAPHS, HttpLink>;
};

export type GraphEndpoints = {
  [key: number]: Record<SUPPORTED_GRAPHS, string>;
};

export const GRAPH_ENDPOINTS: GraphEndpoints = Object.freeze({
  // Ethereum Mainnet
  1: {
    backend: process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_ENDPOINT || '',
    theGraph: process.env.NEXT_PUBLIC_SATSUMA_MAINNET_ENDPOINT || ''
  },
  // Rinkeby
  // rinkeby not updated with satsuma because it will be sunset
  4: {
    backend: process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_ENDPOINT || '',
    theGraph: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || ''
  },
  // Goerli
  5: {
    backend: process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_ENDPOINT || '',
    theGraph: process.env.NEXT_PUBLIC_SATSUMA_GOERLI_ENDPOINT || ''
  },
  // Matic
  137: {
    backend: process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_ENDPOINT || '',
    theGraph: process.env.NEXT_PUBLIC_SATSUMA_MATIC_ENDPOINT || ''
  }
});
