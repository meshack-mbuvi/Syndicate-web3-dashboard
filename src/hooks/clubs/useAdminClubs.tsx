import { MY_CLUBS_QUERY } from '@/graphql/subgraph_queries';
import { processClubERC20Tokens } from '@/hooks/clubs/utils/helpers';
import { IClubERC20 } from '@/hooks/clubs/utils/types';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { Status } from '@/state/wallet/types';
import { useApolloClient, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

const useAdminClubs = (): {
  adminClubs: IClubERC20[];
  adminClubsLoading: boolean;
} => {
  const {
    initializeContractsReducer: { syndicateContracts },
    web3Reducer: {
      web3: { account, activeNetwork, web3, status }
    }
  } = useSelector((state: AppState) => state);

  const apolloClient = useApolloClient();

  const router = useRouter();
  const accountAddress = useMemo(() => account?.toLocaleLowerCase(), [account]);
  const [adminClubs, setAdminClubs] = useState<IClubERC20[]>([]);

  // Retrieve syndicates that I manage
  const { loading, data, refetch } = useQuery(MY_CLUBS_QUERY, {
    variables: {
      where: { ownerAddress: accountAddress }
    },
    context: {
      clientName: SUPPORTED_GRAPHS.THE_GRAPH,
      chainId: activeNetwork.chainId
    },
    // Avoid unnecessary calls when account is not defined
    skip:
      !accountAddress ||
      !router.isReady ||
      !activeNetwork.chainId ||
      status !== Status.CONNECTED
  });

  useEffect(() => {
    void refetch({
      where: { ownerAddress: accountAddress }
    });
  }, [activeNetwork.chainId, accountAddress]);

  // Process clubs a given wallet manages
  useEffect(() => {
    if (loading || !data?.syndicateDAOs) return;

    void processClubERC20Tokens(
      account,
      data?.syndicateDAOs,
      activeNetwork,
      web3,
      syndicateContracts,
      apolloClient
    ).then((processedClubs) => {
      setAdminClubs(processedClubs);
    });
  }, [loading, data]);

  return {
    adminClubs,
    adminClubsLoading: loading || (adminClubs.length == 0 && data == null)
  };
};

export default useAdminClubs;
