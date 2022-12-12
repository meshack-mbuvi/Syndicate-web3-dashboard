import { GetDealPrecommits } from '@/graphql/queries';
import { AppState } from '@/state';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useDemoMode } from '../useDemoMode';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
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

  const [precommits, setPrecommits] = useState<IPrecommit[]>([]);

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
      chainId: activeNetwork.chainId
    }
  });

  // process precommits
  useEffect(() => {
    if (loading) {
      return;
    }
    let isComponentMounted = true;

    if (data && isComponentMounted) {
      setPrecommits(
        data.deal?.precommits.map((pre: Precommit) => {
          //TODO [WINGZ]: should amount be converted?
          return {
            dealAddress: data.deal.id,
            address: pre.userAddress,
            amount: pre.amount,
            status: pre.status,
            createdAt: pre.createdAt
          };
        })
      );
    }
    return (): void => {
      isComponentMounted = false;
    };
  }, [loading, data, activeNetwork?.chainId]);

  return {
    precommits,
    precommitsLoading: false
  };
};

export default useDealsPrecommits;
