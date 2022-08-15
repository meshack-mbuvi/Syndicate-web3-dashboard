import { TokenDetails } from '@/types/token';
import { AxiosResponse } from 'axios';
import { proxyGet } from '.';

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
