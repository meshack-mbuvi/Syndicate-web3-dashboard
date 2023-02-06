import { MERKLE_AIRDROP_CREATED } from '@/graphql/subgraph_queries';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import {
  clearAirdropInfo,
  setAirdropInfo,
  setLoadingAirdropInfo
} from '@/state/airdropInfo/slice';
import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
    data: airdropData = {},
    refetch
  } = useQuery(MERKLE_AIRDROP_CREATED, {
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
      refetch();
    }
  }, [myMerkleProof.amount, account, clubAddress, activeNetwork.chainId]);

  useEffect(() => {
    dispatch(setLoadingAirdropInfo(true));
    if (airdropData.merkleAirdropCreatedERC20S?.length) {
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
      // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
      dispatch(clearAirdropInfo());
    }
  }, [loading, JSON.stringify(airdropData)]);

  return { loading };
};

export default useFetchAirdropInfo;
