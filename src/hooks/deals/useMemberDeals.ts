import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { Status } from '@/state/wallet/types';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Deal,
  StatusType,
  useMemberPrecommitsQuery
} from '../data-fetching/thegraph/generated-types';
import { processDealsToDealPreviews } from './helpers';
import { DealPreview } from './types';

const useMemberDeals = (): {
  memberDeals: DealPreview[];
  memberDealsLoading: boolean;
} => {
  const {
    web3Reducer: {
      web3: { account, status, activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const abortController = new AbortController();

  const router = useRouter();
  const walletAddress = useMemo(() => account?.toLowerCase(), [account]);
  let memberDeals = new Array<DealPreview>();

  // retrieve member deals
  const { loading, refetch, data, error } = useMemberPrecommitsQuery({
    variables: {
      where: {
        userAddress: walletAddress,
        status_not: 'CANCELED' as StatusType
      }
    },
    context: {
      clientName: SUPPORTED_GRAPHS.THE_GRAPH,
      chainId: activeNetwork.chainId,
      fetchOptions: {
        signal: abortController.signal
      }
    },
    errorPolicy: 'none',
    skip:
      !walletAddress ||
      !router.isReady ||
      !activeNetwork.chainId ||
      status !== Status.CONNECTED ||
      activeNetwork.chainId !== 5 //TODO: hardcoded check only for goerli until contracts are on other chains
  });

  useEffect(() => {
    //TODO: hardcoded check only for goerli until contracts are on other chains
    if (error || activeNetwork.chainId !== 5) {
      return;
    }

    void refetch({
      where: {
        userAddress: walletAddress,
        status_not: 'CANCELED' as StatusType
      }
    });

    return () => {
      abortController.abort();
    };
  }, [activeNetwork.chainId, walletAddress]);

  if (!loading && data?.precommits) {
    memberDeals = processDealsToDealPreviews(
      data.precommits.map((precommit) => precommit.deal as Deal)
    );
  } else {
    memberDeals = [];
  }

  return {
    memberDeals,
    memberDealsLoading: loading
  };
};

export default useMemberDeals;
