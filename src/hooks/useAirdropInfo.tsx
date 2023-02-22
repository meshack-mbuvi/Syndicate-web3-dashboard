import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAirdropCreatedQuery } from './data-fetching/thegraph/generated-types';
import { useDemoMode } from './useDemoMode';
import useFetchMerkleProof from '@/hooks/useMerkleProof';

export interface IAirdropInfo {
  id: string;
  club: string;
  treeIndex: string;
  endTime: number;
  startTime: number;
  root: string;
}

const emptyAirdropInfo: IAirdropInfo = {
  id: '',
  club: '',
  treeIndex: '',
  endTime: 0,
  startTime: 0,
  root: ''
};

const useFetchAirdropInfo = (): {
  airdropInfoLoading: boolean;
  airdropInfo: IAirdropInfo;
} => {
  const {
    web3Reducer: {
      web3: { account, activeNetwork }
    },
    erc20TokenSliceReducer: {
      erc20Token: { address: clubAddress }
    }
  } = useSelector((state: AppState) => state);

  const isDemoMode = useDemoMode();

  const { merkleProofLoading: merkleLoading, merkleProof: myMerkleProof } =
    useFetchMerkleProof();

  const [airdropInfo, setAirdropInfo] = useState(emptyAirdropInfo);

  // Fetch existing claims
  const { loading, data: airdropData } = useAirdropCreatedQuery({
    variables: {
      where: {
        club: clubAddress.toLowerCase(),
        treeIndex: myMerkleProof.treeIndex
      }
    },
    skip: !account || !activeNetwork.chainId || isDemoMode || merkleLoading,
    context: {
      clientName: SUPPORTED_GRAPHS.THE_GRAPH,
      chainId: activeNetwork.chainId
    }
  });

  useEffect(() => {
    if (loading) return;

    if (airdropData?.merkleAirdropCreatedERC20S?.length) {
      const airdropObj =
        airdropData.merkleAirdropCreatedERC20S[
          airdropData.merkleAirdropCreatedERC20S.length - 1
        ];
      setAirdropInfo({
        ...airdropObj,
        endTime: parseInt(airdropObj.endTime),
        startTime: parseInt(airdropObj.startTime)
      });
    }
  }, [loading, JSON.stringify(airdropData)]);

  return { airdropInfoLoading: loading, airdropInfo };
};

export default useFetchAirdropInfo;
