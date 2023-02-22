import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { getFirstOrString } from '@/utils/stringUtils';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  StatusType,
  usePrecommitQuery
} from '../data-fetching/thegraph/generated-types';
import { Precommit } from './types';

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

  const dealAddress = getFirstOrString(router.query.dealAddress) || '';

  const abortController = new AbortController();

  // get precommit for a specific member
  const { loading, data, startPolling, stopPolling } = usePrecommitQuery({
    variables: {
      where: {
        userAddress: account.toLowerCase(),
        deal_: {
          id: dealAddress
        },
        status_not: 'CANCELED' as StatusType
      }
    },
    skip: !dealAddress || !account || !activeNetwork.chainId,
    context: {
      clientName: SUPPORTED_GRAPHS.THE_GRAPH,
      chainId: activeNetwork.chainId,
      fetchOptions: {
        signal: abortController.signal
      }
    }
  });

  useEffect(() => {
    if (overridePoll) {
      startPolling(2000);
    } else {
      stopPolling;
    }
  }, [overridePoll]);

  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, [activeNetwork.chainId, dealAddress, account]);

  return {
    precommit: data?.precommits[0],
    precommitLoading: loading || overridePoll
  };
};

export default useMemberPrecommit;
