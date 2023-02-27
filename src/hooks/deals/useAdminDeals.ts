import { GetAdminDeals } from '@/graphql/subgraph_queries';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { Status } from '@/state/wallet/types';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { processDealsToDealPreviews } from './helpers';
import { Deal, DealPreview } from './types';

const useAdminDeals = (): {
  adminDeals: DealPreview[];
  adminDealsLoading: boolean;
} => {
  const {
    web3Reducer: {
      web3: { account, status, activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const abortController = new AbortController();

  const router = useRouter();
  const walletAddress = useMemo(() => account.toLowerCase(), [account]);
  let adminDeals = new Array<DealPreview>();

  // retrieve admin deals
  const { loading, refetch, data, error } = useQuery<{ deals: Deal[] }>(
    GetAdminDeals,
    {
      variables: {
        where: { ownerAddress: walletAddress }
      },
      context: {
        clientName: SUPPORTED_GRAPHS.THE_GRAPH,
        chainId: activeNetwork.chainId,
        fetchOptions: {
          signal: abortController.signal
        }
      },
      skip:
        !walletAddress ||
        !router.isReady ||
        !activeNetwork.chainId ||
        status !== Status.CONNECTED ||
        activeNetwork.chainId !== 5 //TODO: hardcoded check only for goerli until contracts are on other chains
    }
  );

  useEffect(() => {
    //TODO: hardcoded check only for goerli until contracts are on other chains
    if (error || activeNetwork.chainId !== 5) {
      return;
    }
    refetch({
      where: { ownerAddress: walletAddress }
    });
    return () => {
      abortController.abort();
    };
  }, [activeNetwork.chainId, walletAddress]);

  if (!loading && data?.deals) {
    adminDeals = processDealsToDealPreviews(data.deals);
  } else {
    adminDeals = [];
  }

  return {
    adminDeals,
    adminDealsLoading: loading && !data
  };
};

export default useAdminDeals;
