import { ClubERC20Contract } from '@/ClubERC20Factory/clubERC20';
import { processClubERC20Tokens } from '@/hooks/clubs/utils/helpers';
import { CustomSyndicateDao } from '@/hooks/clubs/utils/types';
import { useGetCubsIAdminQuery } from '@/hooks/data-fetching/thegraph/generated-types';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { Status } from '@/state/wallet/types';
import { useApolloClient } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

type myClubs = {
  clubName: string;
  clubSymbol: string;
}[];

const useAdminClubs = (): {
  adminClubs: Partial<CustomSyndicateDao>[];
  loading: boolean;
  totalClubs: number;
  myClubs: myClubs;
} => {
  const {
    initializeContractsReducer: { syndicateContracts },
    web3Reducer: {
      web3: { account, web3, activeNetwork, status }
    }
  } = useSelector((state: AppState) => state);

  const apolloClient = useApolloClient();
  const abortController = new AbortController();

  const router = useRouter();
  const accountAddress = useMemo(() => account?.toLocaleLowerCase(), [account]);
  const [adminClubs, setAdminClubs] = useState<Partial<CustomSyndicateDao>[]>(
    []
  );
  const [myClubs, setMyClubs] = useState<myClubs | undefined>();

  const { loading, data, error, refetch } = useGetCubsIAdminQuery({
    variables: {
      where: { ownerAddress: accountAddress }
    },
    context: {
      clientName: SUPPORTED_GRAPHS.THE_GRAPH,
      chainId: activeNetwork.chainId
    },
    skip:
      !accountAddress ||
      !router.isReady ||
      !activeNetwork.chainId ||
      status !== Status.CONNECTED ||
      activeNetwork.chainId === 0
  });

  useEffect(() => {
    if (!error && activeNetwork.chainId !== 0) {
      void refetch({
        where: { ownerAddress: accountAddress }
      });
    }
    return () => {
      abortController.abort();
    };
  }, [activeNetwork.chainId, accountAddress]);

  const processMyClubs = async (
    tokens: Partial<CustomSyndicateDao>[] | undefined
  ): Promise<void> => {
    if (!tokens) return;
    const _clubs: myClubs = [];

    await Promise.all([
      ...tokens.map(async (token) => {
        const { contractAddress } = token;

        let clubERC20Contract;

        if (!contractAddress) return;

        try {
          clubERC20Contract = new ClubERC20Contract(
            contractAddress,
            web3,
            activeNetwork
          );

          _clubs.push({
            clubName: await clubERC20Contract.name(),
            clubSymbol: await clubERC20Contract.symbol()
          });
        } catch (error) {
          return;
        }
      })
    ])
      .then((res) => res)
      .catch(() => {
        return [];
      });

    if (_clubs.length > 0) {
      setMyClubs(_clubs);
    }
  };

  // Process clubs a given wallet manages
  useEffect(() => {
    if (loading || !data?.syndicateDAOs) return;

    void processMyClubs(data?.syndicateDAOs);

    processClubERC20Tokens(
      account,
      data?.syndicateDAOs,
      activeNetwork,
      syndicateContracts,
      apolloClient,
      abortController.signal
    )
      .then((processedClubs) => {
        if (processedClubs) {
          setAdminClubs(processedClubs);
        }
      })
      .catch(() => setAdminClubs([]));
  }, [loading, data]);

  return {
    adminClubs,
    myClubs: myClubs || [],
    totalClubs: myClubs?.length || 0,
    loading: loading || (adminClubs.length == 0 && data == null)
  };
};

export default useAdminClubs;
