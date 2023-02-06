import { GetAdminDeals } from '@/graphql/satsuma_queries';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { Status } from '@/state/wallet/types';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { processDealsToDealPreviews } from './helpers';
import { Deal, DealPreview } from './types';

const useAdminDeals = (): {
  adminDeals: DealPreview[];
  adminDealsLoading: boolean;
} => {
  const {
    web3Reducer: {
      web3: { account, activeNetwork, status }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();

  const walletAddress = useMemo(() => account.toLowerCase(), [account]);
  const [adminDeals, setAdminDeals] = useState<DealPreview[]>([]);

  // retrieve admin deals
  const { loading, refetch, data } = useQuery<{ deals: Deal[] }>(
    GetAdminDeals,
    {
      variables: {
        where: { ownerAddress: walletAddress }
      },
      context: {
        clientName: SUPPORTED_GRAPHS.THE_GRAPH,
        chainId: activeNetwork.chainId
      },
      skip:
        !walletAddress ||
        !router.isReady ||
        !activeNetwork.chainId ||
        status !== Status.CONNECTED
    }
  );

  useEffect(() => {
    void refetch({
      where: { ownerAddress: walletAddress }
    });
  }, [activeNetwork.chainId, walletAddress, refetch]);

  useEffect(() => {
    if (loading || !data?.deals) return;
    let isComponentMounted = true;
    if (data && isComponentMounted) {
      setAdminDeals(processDealsToDealPreviews(data.deals));
    }

    return (): void => {
      isComponentMounted = false;
    };
  }, [loading, data]);

  return {
    adminDeals,
    adminDealsLoading: loading || (adminDeals.length == 0 && data != null)
  };
};

export default useAdminDeals;
