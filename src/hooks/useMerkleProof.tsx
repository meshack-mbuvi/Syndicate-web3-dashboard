import { INDEX_AND_PROOF } from '@/graphql/merkleDistributor';
import { AppState } from '@/state';
import {
  clearMerkleProof,
  setLoadingMerkleProof,
  setMerkleProof
} from '@/state/merkleProofs/slice';
import { Status } from '@/state/wallet/types';
import { getWeiAmount } from '@/utils/conversions';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDemoMode } from './useDemoMode';

const useFetchMerkleProof: any = (skipQuery = false) => {
  const dispatch = useDispatch();

  const {
    web3Reducer: {
      web3: { account: address, web3, activeNetwork, status }
    },
    erc20TokenSliceReducer: {
      erc20Token: { address: clubAddress, tokenDecimals }
    }
  } = useSelector((state: AppState) => state);

  const isDemoMode = useDemoMode();

  const router = useRouter();

  const {
    loading,
    data: merkleData = {},
    refetch: refetchMerkle
  } = useQuery(INDEX_AND_PROOF, {
    variables: { clubAddress, address, chainId: activeNetwork.chainId },
    skip:
      !address ||
      !clubAddress ||
      skipQuery ||
      !activeNetwork.chainId ||
      isDemoMode,
    context: { clientName: 'backend', chainId: activeNetwork.chainId }
  });

  const processMerkleProofData = async (merkleObj) => {
    dispatch(setLoadingMerkleProof(true));
    dispatch(
      setMerkleProof({
        ...merkleObj,
        account: address,
        _amount: getWeiAmount(web3, merkleObj?.amount, tokenDecimals, false)
      })
    );
    dispatch(setLoadingMerkleProof(false));
  };

  useEffect(() => {
    if (
      !activeNetwork.chainId ||
      !clubAddress ||
      !address ||
      status !== Status.CONNECTED
    )
      return;

    if (router.isReady && web3.utils.isAddress(clubAddress)) {
      refetchMerkle();
    }
  }, [clubAddress, address, activeNetwork.chainId, status]);

  useEffect(() => {
    dispatch(setLoadingMerkleProof(true));
    if (merkleData.Financial_getIndexAndProof?.accountIndex >= 0) {
      processMerkleProofData(merkleData.Financial_getIndexAndProof);
    } else {
      dispatch(clearMerkleProof());
    }
  }, [address, loading, JSON.stringify(merkleData)]);

  return { loading };
};

export default useFetchMerkleProof;
