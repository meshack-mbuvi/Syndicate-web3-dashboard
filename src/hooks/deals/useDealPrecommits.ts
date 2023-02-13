import { GetDealPrecommits } from '@/graphql/subgraph_queries';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDemoMode } from '../useDemoMode';
import { Precommit } from './types';

export interface IPrecommit {
  dealAddress: string;
  address: string;
  amount: string;
  status: string;
  createdAt: string;
}

export interface IPrecommitResponse {
  precommits: IPrecommit[];
  precommitsLoading: boolean;
}

const useDealsPrecommits = (): IPrecommitResponse => {
  const {
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();
  const {
    query: { dealAddress }
  } = router;

  const isDemoMode = useDemoMode();
  const abortController = new AbortController();

  let precommits = <IPrecommit[]>[];

  // get precommits for a deal
  const { loading, data } = useQuery<{
    deal: { id: string; precommits: Precommit[] };
  }>(GetDealPrecommits, {
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
    precommits = data.deal?.precommits.map((pre: Precommit) => {
      return {
        dealAddress: data.deal.id,
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

  console.log('loading precommits', loading);
  return {
    precommits,
    precommitsLoading: loading
  };
};

export default useDealsPrecommits;
