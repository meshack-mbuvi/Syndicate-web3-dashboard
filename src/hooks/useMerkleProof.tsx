import { INDEX_AND_PROOF } from "@/graphql/merkleDistributor";
import { AppState } from "@/state";
import { useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  setLoadingMerkleProof,
  setMerkleProof,
  clearMerkleProof,
} from "@/state/merkleProofs/slice";
import { getWeiAmount } from "@/utils/conversions";

const useFetchMerkleProof: any = (skipQuery = false) => {
  const dispatch = useDispatch();

  const {
    web3Reducer: {
      web3: { account: address, web3 },
    },
    erc20TokenSliceReducer: {
      erc20Token: { address: clubAddress, tokenDecimals },
    },
  } = useSelector((state: AppState) => state);

  const router = useRouter();

  const {
    loading,
    data: merkleData = {},
    refetch: refetchMerkle,
  } = useQuery(INDEX_AND_PROOF, {
    variables: { clubAddress, address },
    skip: !address || skipQuery,
    context: { clientName: "backend" },
  });

  const processMerkleProofData = async (merkleObj) => {
    dispatch(setLoadingMerkleProof(true));
    await dispatch(
      setMerkleProof({
        ...merkleObj,
        account: address,
        _amount: getWeiAmount(merkleObj?.amount, tokenDecimals, false),
      }),
    );
    dispatch(setLoadingMerkleProof(false));
  };

  useEffect(() => {
    if (router.isReady && web3.utils.isAddress(clubAddress)) {
      refetchMerkle();
    }
  }, [clubAddress, address, router.isReady]);

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
