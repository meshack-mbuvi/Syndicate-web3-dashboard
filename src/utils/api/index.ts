import { GRAPH_ENDPOINTS } from '@/Networks';
import { TokenDetails } from '@/types/token';
import axios, { AxiosResponse } from 'axios';

export const proxyGet = async <R>(
  path: string,
  params: any
): Promise<AxiosResponse<R>> => {
  return await axios.get<R>(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/${path}`,
    {
      params
    }
  );
};

export const proxyPost = async <R>(
  path: string,
  data: any,
  config: any
): Promise<AxiosResponse<R>> => {
  return await axios.post<R>(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/${path}`,
    data,
    config
  );
};

// Queries the web2-backend endpoint 'token/details' OR 'token/native_token_details' for native tokens with no contract address
export const getTokenDetails = (
  tokenAddress: string,
  chainId: number
): Promise<AxiosResponse<TokenDetails>> => {
  let endpoint = 'token/details';

  if (tokenAddress?.length == 0) {
    endpoint = 'token/native_token_details';
  }

  return proxyGet(endpoint, {
    tokenAddress: tokenAddress,
    chainId: chainId
  });
};

export const getCollectivesDetails = async (
  tokenAddresses: string[],
  chainId: number
): Promise<
  AxiosResponse<{
    data: {
      syndicateCollectives: {
        contractAddress: string;
        ownerAddress: string;
        createdAt: string;
        name: string;
        symbol: string;
        nftMetadata: {
          description: string;
          metadataCid: string;
          mediaCid: string;
        };
      }[];
    };
  }>
> => {
  const query = `query SyndicateCollectives($where: SyndicateCollective_filter) {
    syndicateCollectives(where: $where) {
      contractAddress
      ownerAddress
      createdAt
      name
      symbol
      nftMetadata {
        description
        metadataCid
        mediaCid
      }
    }
  }`;

  try {
    return await axios({
      url: GRAPH_ENDPOINTS[chainId].theGraph,
      method: 'POST',
      data: JSON.stringify({
        query,
        variables: {
          where: {
            contractAddress_in: tokenAddresses
          }
        }
      })
    });
  } catch (error) {
    // @ts-expect-error TS(2322): Type 'undefined' is not assignable to type 'AxiosResponse<{ data: { syndicateCollectives:...
    return;
  }
};

export const getAccountHoldings = async (
  includeAddresses: string[],
  chainId: number,
  walletAddress: string
): Promise<
  AxiosResponse<{
    data: {
      tokenHoldings: {
        balance: number;
        token: {
          address: string;
          name: string;
          symbol: string;
          decimals: number | undefined;
          logo: string | undefined;
        };
      }[];
    };
  }>
> => {
  const query = `query Query(
    $chainId: Int!
    $walletAddress: String!
    $filter: TokenHoldingsFilter
  ) {
    tokenHoldings(
      chainId: $chainId
      walletAddress: $walletAddress
      filter: $filter
    ) {
      balance
      token {
        address
        name
        symbol
        decimals
        logo
      }
    }
  }
  `;

  return await axios({
    url: GRAPH_ENDPOINTS[chainId].backend,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      query,
      variables: {
        chainId,
        walletAddress,
        filter: {
          includeAddresses
        }
      }
    })
  });
};
