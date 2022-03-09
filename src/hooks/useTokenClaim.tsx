import { CLAIMED_TOKEN } from "@/graphql/queries";
import { AppState } from "@/state";
import {
  clearTokenClaimed,
  setLoadingTokenClaimed,
  setTokenClaimed,
} from "@/state/claimedToken/slice";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useFetchTokenClaim: any = (skipQuery) => {
  const dispatch = useDispatch();

  const {
    web3Reducer: {
      web3: { account, activeNetwork },
    },
    merkleProofSliceReducer: { myMerkleProof },
    erc20TokenSliceReducer: {
      erc20Token: { address: clubAddress },
    },
  } = useSelector((state: AppState) => state);

  // Fetch existing claims
  const {
    loading,
    data: claimData = {},
    refetch,
  } = useQuery(CLAIMED_TOKEN, {
    variables: {
      where: {
        claimant: account.toLowerCase(),
        club: clubAddress.toLowerCase(),
        amount: myMerkleProof.amount,
        treeIndex: myMerkleProof.treeIndex,
      },
    },
    skip: !account || skipQuery,
    context: { clientName: "theGraph", chainId: activeNetwork.chainId },
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
    dispatch(setLoadingTokenClaimed(true));
    if (claimData.tokensClaimedERC20S?.length) {
      dispatch(
        setTokenClaimed({
          ...claimData.tokensClaimedERC20S[0],
          claimed: true,
        }),
      );
      dispatch(setLoadingTokenClaimed(false));
    } else {
      dispatch(clearTokenClaimed());
    }
  }, [loading, JSON.stringify(claimData)]);

  return { loading };
};

export default useFetchTokenClaim;
