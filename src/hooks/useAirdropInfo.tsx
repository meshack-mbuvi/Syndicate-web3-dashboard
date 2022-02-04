import { MERKLE_AIRDROP_CREATED } from "@/graphql/queries";
import { AppState } from "@/state";
import { useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  setLoadingAirdropInfo,
  setAirdropInfo,
  clearAirdropInfo,
} from "@/state/airdropInfo/slice";

const useFetchAirdropInfo: any = (skipQuery) => {
  const dispatch = useDispatch();

  const {
    web3Reducer: {
      web3: { account, },
    },
    merkleProofSliceReducer: { myMerkleProof },
    erc20TokenSliceReducer: {
      erc20Token: { address: clubAddress },
    },
  } = useSelector((state: AppState) => state);

  // Fetch existing claims
  const {
    loading,
    data: airdropData = {},
    refetch,
  } = useQuery(MERKLE_AIRDROP_CREATED, {
    variables: {
      where: {
        club: clubAddress.toLowerCase(),
        treeIndex: myMerkleProof.treeIndex,
      },
    },
    skip: !account || skipQuery,
    context: { clientName: "graph" },
  });

  useEffect(() => {
    if (myMerkleProof.amount && account && clubAddress) {
      refetch();
    }
  }, [myMerkleProof.amount, account, clubAddress]);

  useEffect(() => {
    dispatch(setLoadingAirdropInfo(true));
    if (airdropData.merkleAirdropCreatedERC20S?.length) {
      const airdropObj = airdropData.merkleAirdropCreatedERC20S[0];
      dispatch(
        setAirdropInfo({
          ...airdropObj,
          endTime: parseInt(airdropObj.endTime),
          startTime: parseInt(airdropObj.startTime),
        }),
      );
      dispatch(setLoadingAirdropInfo(false));
    } else {
      dispatch(clearAirdropInfo());
    }
  }, [loading, JSON.stringify(airdropData)]);

  return { loading };
};

export default useFetchAirdropInfo;
