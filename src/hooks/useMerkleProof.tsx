import { INDEX_AND_PROOF } from '@/graphql/merkleDistributor';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
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
import { useEffect } from 'react';
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
    context: {
      clientName: SUPPORTED_GRAPHS.BACKEND,
      chainId: activeNetwork.chainId
    }
  });

  const processMerkleProofData = async (merkleObj: any): Promise<void> => {
    dispatch(setLoadingMerkleProof(true));
    dispatch(
      setMerkleProof({
        ...merkleObj,
        account: address,
        _amount: getWeiAmount(merkleObj?.amount, tokenDecimals, false)
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

    if (router.isReady && web3 && web3.utils.isAddress(clubAddress)) {
      void refetchMerkle();
    }
  }, [clubAddress, address, activeNetwork.chainId, status]);

  useEffect(() => {
    dispatch(setLoadingMerkleProof(true));
    if (merkleData.Financial_getIndexAndProof?.accountIndex >= 0) {
      void processMerkleProofData(merkleData.Financial_getIndexAndProof);
    } else {
      dispatch(clearMerkleProof());
    }
  }, [address, loading, JSON.stringify(merkleData)]);

  return { loading };
};

export default useFetchMerkleProof;
