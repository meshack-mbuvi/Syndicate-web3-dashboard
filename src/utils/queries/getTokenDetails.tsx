import { TokenDetails, EmptyTokenDetails } from '@/hooks/useTokenDetails';
import { TOKEN_DETAILS } from '@/graphql/queries';
import { ApolloClient } from '@apollo/client';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';

export type TokenDetailsQuery = {
  data: { token?: TokenDetails };
  loading: boolean;
  networkStatus: number;
};

export const getTokenDetails = async (
  address: string,
  chainId: number,
  apolloClient: ApolloClient<any>
): Promise<TokenDetails> => {
  try {
    const response: TokenDetailsQuery = await apolloClient.query({
      query: TOKEN_DETAILS,
      variables: {
        address,
        chainId
      },
      context: {
        clientName: SUPPORTED_GRAPHS.BACKEND,
        chainId
      }
    });
    return response?.data.token || EmptyTokenDetails;
  } catch (e) {
    return EmptyTokenDetails;
  }
};
