import { MERKLE_AIRDROP_CREATED } from '@/graphql/queries';
import { AppState } from '@/state';
import {
  clearAirdropInfo,
  setAirdropInfo,
  setLoadingAirdropInfo
} from '@/state/airdropInfo/slice';
import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useFetchAirdropInfo: any = (skipQuery) => {
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
    skip: !account || !activeNetwork.chainId || skipQuery,
    context: { clientName: 'theGraph', chainId: activeNetwork.chainId }
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
      dispatch(clearAirdropInfo());
    }
  }, [loading, JSON.stringify(airdropData)]);

  return { loading };
};

export default useFetchAirdropInfo;
