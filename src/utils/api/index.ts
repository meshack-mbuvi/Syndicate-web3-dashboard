import { BACKEND_LINKS } from '@/Networks';
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

/**
 * A token will return something
 *
 * @param tokenAddress
 * @param chainId
 * @returns
 */
export const getSynToken = async (
  tokenAddress: string,
  chainId: number
): Promise<AxiosResponse> => {
  const query = `query GetSynToken($chainId: Int, $where: SyndicateDAO_filter) {
    syndicateDAOs(chainId: $chainId, where: $where) {
      contractAddress
    }
  }`;

  try {
    return await axios({
      url: BACKEND_LINKS[chainId].graphs.theGraph,
      method: 'POST',
      data: JSON.stringify({
        query,
        variables: { chainId, where: { contractAddress: tokenAddress } }
      })
    });
  } catch (error) {
    return;
  }
};
