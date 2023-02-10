import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import {
  clearAirdropInfo,
  setAirdropInfo,
  setLoadingAirdropInfo
} from '@/state/airdropInfo/slice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAirdropCreatedQuery } from './data-fetching/thegraph/generated-types';
import { useDemoMode } from './useDemoMode';

const useFetchAirdropInfo: any = (skipQuery: any) => {
  const dispatch = useDispatch();

  const {
    web3Reducer: {
      web3: { account, activeNetwork }
    },
    merkleProofSliceReducer: { myMerkleProof },
    erc20TokenSliceReducer: {
      erc20Token: { address: clubAddress }
    }
  } = useSelector((state: AppState) => state);

  const isDemoMode = useDemoMode();

  // Fetch existing claims
  const {
    loading,
    data: airdropData,
    refetch
  } = useAirdropCreatedQuery({
    variables: {
      where: {
        club: clubAddress.toLowerCase(),
        treeIndex: myMerkleProof.treeIndex
      }
    },
    skip: !account || !activeNetwork.chainId || skipQuery || isDemoMode,
    context: {
      clientName: SUPPORTED_GRAPHS.THE_GRAPH,
      chainId: activeNetwork.chainId
    }
  });

  useEffect(() => {
    if (
      myMerkleProof.amount &&
      account &&
      clubAddress &&
      activeNetwork.chainId
    ) {
      void refetch();
    }
  }, [myMerkleProof.amount, account, clubAddress, activeNetwork.chainId]);

  useEffect(() => {
    dispatch(setLoadingAirdropInfo(true));
    if (airdropData?.merkleAirdropCreatedERC20S?.length) {
      const airdropObj =
        airdropData.merkleAirdropCreatedERC20S[
          airdropData.merkleAirdropCreatedERC20S.length - 1
        ];
      dispatch(
        setAirdropInfo({
          ...airdropObj,
          endTime: parseInt(airdropObj.endTime),
          startTime: parseInt(airdropObj.startTime)
        })
      );
      dispatch(setLoadingAirdropInfo(false));
    } else {
      dispatch(clearAirdropInfo());
    }
  }, [loading, JSON.stringify(airdropData)]);

  return { loading };
};

export default useFetchAirdropInfo;
