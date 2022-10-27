import { TOKEN_DETAILS } from '@/graphql/queries';
import { NETWORKS } from '@/Networks';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { ApolloClient } from '@apollo/client';
import { toInteger } from 'lodash';
import { isZeroAddress } from '../isZeroAddress';

export type ITokenDetails = {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logo: string;
};

export type ITokenDetailsResponse = {
  token: ITokenDetails;
};

export const getTokenDetails = async (
  tokenAddress: string,
  chainId: number,
  apolloClient: ApolloClient<any>
): Promise<ITokenDetails> => {
  if (isZeroAddress(tokenAddress)) {
    return {
      chainId,
      address: tokenAddress,
      name: NETWORKS[chainId].nativeCurrency.name,
      symbol: NETWORKS[chainId].nativeCurrency.symbol,
      decimals: toInteger(NETWORKS[chainId].nativeCurrency.decimals),
      logo: NETWORKS[chainId].nativeCurrency.logo
    };
  }

  const response = await apolloClient.query<ITokenDetailsResponse>({
    query: TOKEN_DETAILS,
    variables: {
      chainId,
      address: tokenAddress
    },
    context: { clientName: SUPPORTED_GRAPHS.BACKEND, chainId }
  });

  return response.data.token;
};
