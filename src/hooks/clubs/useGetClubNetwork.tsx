/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CLUB_TOKEN_QUERY } from '@/graphql/queries';
import { NETWORKS } from '@/Networks';
import { GRAPH_ENDPOINTS, SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { INetwork } from '@/Networks/networks';
import { AppState } from '@/state';
import { useApolloClient, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

/**
 * @dev This hook is used to determine which network a given club exists.
 * This information is very useful in the cases where the user is connected to
 * a wrong network or when network query params are missing on the url.
 *
 * The hook is currently being used in the SyndicateEmptyState component.
 *
 * @returns {boolean, INetwork} object containing loading state and the network
 * where the club exists.
 */
export const useGetClubNetwork = (): {
  isLoading: boolean;
  urlNetwork: INetwork | undefined;
} => {
  const {
    web3Reducer: {
      web3: { activeNetwork }
    },
    erc20TokenSliceReducer: {
      erc20Token: { loading }
    }
  } = useSelector((state: AppState) => state);

  const [urlNetwork, setUrlNetwork] = useState<INetwork>();
  const [isLoading, setIsLoading] = useState(true);

  const {
    query: { clubAddress }
  } = useRouter();

  const apolloClient = useApolloClient();

  const { loading: graphLoading, data } = useQuery(CLUB_TOKEN_QUERY, {
    variables: {
      syndicateDaoId: clubAddress
    },
    context: {
      clientName: SUPPORTED_GRAPHS.THE_GRAPH,
      chainId: activeNetwork.chainId
    },
    notifyOnNetworkStatusChange: true,
    skip: !clubAddress || loading || !activeNetwork.chainId,
    fetchPolicy: 'no-cache'
  });

  const checkOtherNetworks = async (): Promise<void> => {
    const _otherChainIds = [
      ...Object.keys(GRAPH_ENDPOINTS).filter(
        (key) => +key != +activeNetwork.chainId
      )
    ];

    for (const _chainId of _otherChainIds) {
      const { data } = await apolloClient.query({
        query: CLUB_TOKEN_QUERY,
        variables: {
          syndicateDaoId: clubAddress
        },
        context: {
          clientName: SUPPORTED_GRAPHS.THE_GRAPH,
          chainId: +_chainId
        },
        fetchPolicy: 'no-cache'
      });

      if (data.syndicateDAO) {
        setUrlNetwork(NETWORKS[+_chainId]);
        break;
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (graphLoading || !data) return;

    if (!data.syndicateDAO) {
      void checkOtherNetworks();
    } else {
      setIsLoading(false);
    }

    return (): void => {
      setUrlNetwork(undefined);
      setIsLoading(true);
    };
  }, [graphLoading, data]);

  return { isLoading, urlNetwork };
};
