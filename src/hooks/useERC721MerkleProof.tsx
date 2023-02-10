import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import {
  clearERC721MerkleProof,
  setERC721MerkleProof,
  setLoadingERC721MerkleProof
} from '@/state/erc721MerkleProofs/slice';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetErc721IndexAndProofQuery } from './data-fetching/backend/generated-types';

const useFetchMerkleProof: any = (skipQuery = false) => {
  const dispatch = useDispatch();

  const {
    web3Reducer: {
      web3: { account: address, web3, activeNetwork }
    },
    erc721TokenSliceReducer: {
      erc721Token: { address: nftAddress }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();

  const {
    loading,
    data: merkleData = {},
    refetch: refetchMerkle
  } = useGetErc721IndexAndProofQuery({
    variables: {
      clubAddress: nftAddress,
      address,
      chainId: activeNetwork.chainId
    },
    skip: !address || skipQuery || !activeNetwork.chainId,
    context: {
      clientName: SUPPORTED_GRAPHS.BACKEND,
      chainId: activeNetwork.chainId
    }
  });

  const processMerkleProofData = async (merkleObj: any): Promise<void> => {
    dispatch(setLoadingERC721MerkleProof(true));
    await dispatch(
      setERC721MerkleProof({
        ...merkleObj,
        account: address
      })
    );
    dispatch(setLoadingERC721MerkleProof(false));
  };

  useEffect(() => {
    if (
      router.isReady &&
      web3?.utils?.isAddress(nftAddress) &&
      activeNetwork.chainId
    ) {
      void refetchMerkle();
    }
  }, [nftAddress, address, router.isReady, activeNetwork.chainId]);

  useEffect(() => {
    dispatch(setLoadingERC721MerkleProof(true));
    const _merkleAccountIndex =
      merkleData.Financial_getERC721IndexAndProof?.accountIndex;
    if (_merkleAccountIndex && _merkleAccountIndex >= 0) {
      void processMerkleProofData(merkleData.Financial_getERC721IndexAndProof);
    } else {
      dispatch(clearERC721MerkleProof());
    }
  }, [address, loading, JSON.stringify(merkleData)]);

  return { loading };
};

export default useFetchMerkleProof;
