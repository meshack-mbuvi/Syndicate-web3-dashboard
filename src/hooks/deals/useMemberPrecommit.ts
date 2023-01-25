import { GetMemberPrecommit } from '@/graphql/queries';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Precommit } from './types';
import { useEffect } from 'react';

export interface PrecommitResponse {
  precommitLoading: boolean;
  precommit?: Precommit;
}

const useMemberPrecommit = (overridePoll: boolean): PrecommitResponse => {
  const {
    web3Reducer: {
      web3: { activeNetwork, account }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();
  const {
    query: { dealAddress }
  } = router;

  // get precommit for a specific member
  const { loading, data, startPolling, stopPolling } = useQuery<{
    precommits: Precommit[];
  }>(GetMemberPrecommit, {
    variables: {
      where: {
        userAddress: account.toLowerCase(),
        deal_: {
          id: dealAddress
        },
        status_not: 'CANCELED'
      }
    },
    skip: !dealAddress || !account || !activeNetwork.chainId,
    context: {
      clientName: SUPPORTED_GRAPHS.THE_GRAPH,
      chainId: activeNetwork.chainId
    }
  });

  useEffect(() => {
    if (overridePoll) {
      startPolling(2000);
    } else {
      stopPolling;
    }
  }, [overridePoll]);

  return {
    precommit: data?.precommits[0],
    precommitLoading: loading || overridePoll
  };
};

export default useMemberPrecommit;
