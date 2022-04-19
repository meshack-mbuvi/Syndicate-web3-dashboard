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
