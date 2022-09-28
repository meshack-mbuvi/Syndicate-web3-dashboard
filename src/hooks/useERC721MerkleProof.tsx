import { ERC721_INDEX_AND_PROOF } from '@/graphql/merkleDistributor';
import { AppState } from '@/state';
import {
  clearERC721MerkleProof,
  setERC721MerkleProof,
  setLoadingERC721MerkleProof
} from '@/state/erc721MerkleProofs/slice';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
  } = useQuery(ERC721_INDEX_AND_PROOF, {
    variables: {
      clubAddress: nftAddress,
      address,
      chainId: activeNetwork.chainId
    },
    skip: !address || skipQuery || !activeNetwork.chainId,
    context: { clientName: 'backend', chainId: activeNetwork.chainId }
  });

  const processMerkleProofData = async (merkleObj: any) => {
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
      web3.utils.isAddress(nftAddress) &&
      activeNetwork.chainId
    ) {
      refetchMerkle();
    }
  }, [nftAddress, address, router.isReady, activeNetwork.chainId]);

  useEffect(() => {
    dispatch(setLoadingERC721MerkleProof(true));
    if (merkleData.Financial_getERC721IndexAndProof?.accountIndex >= 0) {
      processMerkleProofData(merkleData.Financial_getERC721IndexAndProof);
    } else {
      // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
      dispatch(clearERC721MerkleProof());
    }
  }, [address, loading, JSON.stringify(merkleData)]);

  return { loading };
};

export default useFetchMerkleProof;
