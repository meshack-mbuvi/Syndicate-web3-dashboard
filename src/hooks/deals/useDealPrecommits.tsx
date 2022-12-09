import { GetDealPrecommits } from '@/graphql/queries';
import { AppState } from '@/state';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useDemoMode } from '../useDemoMode';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';

export interface IPrecommit {
  dealAddress: string;
  account: string;
  amount: string;
  status: string;
  createdAt: any;
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
  const { loading, data } = useQuery(GetDealPrecommits, {
    variables: {
      where: {
        contractAddress_contains_nocase: dealAddress
      }
    },
    // TODO: Remove hardcoded "true" when subgraph is ready
    skip: !dealAddress || !activeNetwork.chainId || isDemoMode || true,
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

    if (data) {
      // TODO: Proccess results from query
      // setPrecommits({...});
    }

    // TODO: Remove when subgraph is ready
    setPrecommits([
      {
        dealAddress: '0xdeal',
        account: '0xBf33d3f2c623550c48D7063E0Ac233c8De2dB414',
        amount: '3000',
        status: 'ACTIVE',
        createdAt: '1669731360'
      },
      {
        dealAddress: '0xdeal',
        account: '0x52A4380F691E71ff0015352AB1a450a1dfb689b9',
        amount: '1500',
        status: 'ACTIVE',
        createdAt: '1669731360'
      },
      {
        dealAddress: '0xdeal',
        account: '0x52A4380F691E71ff0015352AB1a450a1dfb689b9',
        amount: '500',
        status: 'ACTIVE',
        createdAt: '1669731360'
      }
    ]);
  }, [loading, data, activeNetwork?.chainId]);

  return {
    precommits,
    precommitsLoading: false
  };
};

export default useDealsPrecommits;
