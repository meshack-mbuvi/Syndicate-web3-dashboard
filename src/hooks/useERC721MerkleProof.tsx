import { ERC721_INDEX_AND_PROOF } from "@/graphql/merkleDistributor";
import { AppState } from "@/state";
import { useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  setLoadingERC721MerkleProof,
  setERC721MerkleProof,
  clearERC721MerkleProof,
} from "@/state/erc721MerkleProofs/slice";

const useFetchMerkleProof: any = (skipQuery = false) => {
  const dispatch = useDispatch();

  const {
    web3Reducer: {
      web3: { account: address, web3 },
    },
    erc721TokenSliceReducer: {
      erc721Token: { address: nftAddress },
    },
  } = useSelector((state: AppState) => state);

  const router = useRouter();

  const {
    loading,
    data: merkleData = {},
    refetch: refetchMerkle,
  } = useQuery(ERC721_INDEX_AND_PROOF, {
    variables: { clubAddress: nftAddress, address },
    skip: !address || skipQuery,
    context: { clientName: "backend" },
  });

  const processMerkleProofData = async (merkleObj) => {
    dispatch(setLoadingERC721MerkleProof(true));
    await dispatch(
      setERC721MerkleProof({
        ...merkleObj,
        account: address,
      }),
    );
    dispatch(setLoadingERC721MerkleProof(false));
  };

  useEffect(() => {
    if (router.isReady && web3.utils.isAddress(nftAddress)) {
      refetchMerkle();
    }
  }, [nftAddress, address, router.isReady]);

  useEffect(() => {
    dispatch(setLoadingERC721MerkleProof(true));
    if (merkleData.Financial_getERC721IndexAndProof?.accountIndex >= 0) {
      processMerkleProofData(merkleData.Financial_getERC721IndexAndProof);
    } else {
      dispatch(clearERC721MerkleProof());
    }
  }, [address, loading, JSON.stringify(merkleData)]);

  return { loading };
};

export default useFetchMerkleProof;
