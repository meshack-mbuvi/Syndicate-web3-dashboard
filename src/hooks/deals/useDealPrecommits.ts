import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { getFirstOrString } from '@/utils/stringUtils';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Precommit,
  usePrecommitsQuery
} from '../data-fetching/thegraph/generated-types';
import { useDemoMode } from '../useDemoMode';

export type IPrecommit = Partial<
  Precommit & { dealAddress: string; ensName?: string }
>;

export interface IPrecommitResponse {
  precommits: IPrecommit[] | undefined;
  precommitsLoading: boolean;
}

const useDealsPrecommits = (): IPrecommitResponse => {
  const {
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();

  const dealAddress = getFirstOrString(router.query.dealAddress) || '';

  const isDemoMode = useDemoMode();
  const abortController = new AbortController();

  let precommits = <IPrecommit[] | undefined>[];

  // get precommits for a deal
  const { loading, data } = usePrecommitsQuery({
    variables: {
      dealId: dealAddress
    },
    skip: !dealAddress || !activeNetwork.chainId || isDemoMode,
    context: {
      clientName: SUPPORTED_GRAPHS.THE_GRAPH,
      chainId: activeNetwork.chainId,
      fetchOptions: {
        signal: abortController.signal
      }
    }
  });

  // process precommits
  if (!loading && data) {
    precommits = data.deal?.precommits.map((pre) => {
      return {
        dealAddress: data?.deal?.id,
        address: pre.userAddress,
        amount: pre.amount,
        status: pre.status,
        createdAt: pre.createdAt
      };
    });
  } else {
    precommits = [];
  }

  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, [activeNetwork.chainId, dealAddress]);

  return {
    precommits,
    precommitsLoading: loading
  };
};

export default useDealsPrecommits;
