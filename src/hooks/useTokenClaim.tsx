import { CLAIMED_TOKEN } from '@/graphql/subgraph_queries';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import {
  clearTokenClaimed,
  setLoadingTokenClaimed,
  setTokenClaimed
} from '@/state/claimedToken/slice';
import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDemoMode } from './useDemoMode';

const useFetchTokenClaim: any = (skipQuery: any) => {
  const dispatch = useDispatch();

  const {
    web3Reducer: {
      web3: { account, activeNetwork }
    },
    merkleProofSliceReducer: { myMerkleProof },
    erc20TokenSliceReducer: {
      erc20Token: { address: clubAddress }
    }
  } = useSelector((state: AppState) => state);

  const isDemoMode = useDemoMode();

  // Fetch existing claims
  const {
    loading,
    data: claimData = {},
    refetch
  } = useQuery(CLAIMED_TOKEN, {
    variables: {
      where: {
        claimant: account.toLowerCase(),
        club: clubAddress.toLowerCase(),
        amount: myMerkleProof.amount,
        treeIndex: myMerkleProof.treeIndex
      }
    },
    skip: !account || skipQuery || !activeNetwork.chainId || isDemoMode,
    context: {
      clientName: SUPPORTED_GRAPHS.THE_GRAPH,
      chainId: activeNetwork.chainId
    }
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
          claimed: true
        })
      );
      dispatch(setLoadingTokenClaimed(false));
    } else {
      // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
      dispatch(clearTokenClaimed());
    }
  }, [loading, JSON.stringify(claimData)]);

  return { loading };
};

export default useFetchTokenClaim;
