import { GetMemberDeals } from '@/graphql/queries';
import { AppState } from '@/state';
import { Status } from '@/state/wallet/types';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { DealPreview, Precommit } from './types';
import { processDealsToDealPreviews } from './helpers';

const useMemberDeals = (): {
  memberDeals: DealPreview[];
  memberDealsLoading: boolean;
} => {
  const {
    web3Reducer: {
      web3: { account, activeNetwork, status }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();
  const [memberDeals, setMemberDeals] = useState<DealPreview[]>([]);
  const walletAddress = useMemo(() => account.toLowerCase(), [account]);

  // retrieve member deals
  const { loading, refetch, data } = useQuery<{ precommits: Precommit[] }>(
    GetMemberDeals,
    {
      variables: {
        where: {
          userAddress: walletAddress
        }
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
      where: {
        userAddress: walletAddress
      }
    });
  }, [activeNetwork.chainId, walletAddress, refetch]);

  useEffect(() => {
    if (loading || !data?.precommits) return;
    let isComponentMounted = true;

    if (isComponentMounted) {
      setMemberDeals(
        processDealsToDealPreviews(
          data.precommits.map((precommit) => precommit.deal)
        )
      );
    }

    return (): void => {
      isComponentMounted = false;
    };
  }, [loading, data]);

  return {
    memberDeals,
    memberDealsLoading: loading || (memberDeals.length == 0 && data != null)
  };
};

export default useMemberDeals;