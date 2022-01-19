import { CLAIMED_TOKEN } from "@/graphql/queries";
import { AppState } from "@/state";
import { useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  setLoadingTokenClaimed,
  setTokenClaimed,
  clearTokenClaimed,
} from "@/state/claimedToken/slice";

const useFetchTokenClaim: any = (skipQuery) => {
  const dispatch = useDispatch();

  const {
    web3Reducer: {
      web3: { account, web3 },
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
    context: { clientName: "graph" },
  });

  useEffect(() => {
    if (myMerkleProof.amount && account && clubAddress) {
      refetch();
    }
  }, [myMerkleProof.amount, account, clubAddress]);

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
