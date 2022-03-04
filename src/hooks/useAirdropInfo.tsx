import { useConnectWalletContext } from "@/context/ConnectWalletProvider";
import { MERKLE_AIRDROP_CREATED } from "@/graphql/queries";
import { AppState } from "@/state";
import {
  clearAirdropInfo,
  setAirdropInfo,
  setLoadingAirdropInfo,
} from "@/state/airdropInfo/slice";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useFetchAirdropInfo: any = (skipQuery) => {
  const dispatch = useDispatch();

  const {
    web3Reducer: {
      web3: { account },
    },
    merkleProofSliceReducer: { myMerkleProof },
    erc20TokenSliceReducer: {
      erc20Token: { address: clubAddress },
    },
  } = useSelector((state: AppState) => state);

  const { chainId } = useConnectWalletContext();

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
    context: { chainId },
  });

  useEffect(() => {
    if (myMerkleProof.amount && account && clubAddress) {
      refetch();
    }
  }, [myMerkleProof.amount, account, clubAddress]);

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
