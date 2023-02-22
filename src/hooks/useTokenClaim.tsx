import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useCheckTokenClaimQuery } from './data-fetching/thegraph/generated-types';
import { useDemoMode } from './useDemoMode';
import useFetchMerkleProof from '@/hooks/useMerkleProof';

const useFetchTokenClaim = (): {
  tokenClaimLoading: boolean;
  isTokenClaimed: boolean;
} => {
  const {
    web3Reducer: {
      web3: { account, activeNetwork }
    },
    erc20TokenSliceReducer: {
      erc20Token: { address: clubAddress }
    }
  } = useSelector((state: AppState) => state);

  const isDemoMode = useDemoMode();

  const { merkleProofLoading: merkleLoading, merkleProof: myMerkleProof } =
    useFetchMerkleProof();

  const [isTokenClaimed, setIsTokenClaimed] = useState(false);

  // Fetch existing claims
  const { loading, data: claimData } = useCheckTokenClaimQuery({
    variables: {
      where: {
        claimant: account.toLowerCase(),
        club: clubAddress.toLowerCase(),
        amount: myMerkleProof.amount,
        treeIndex: myMerkleProof.treeIndex
      }
    },
    skip: !account || !activeNetwork.chainId || isDemoMode || merkleLoading,
    context: {
      clientName: SUPPORTED_GRAPHS.THE_GRAPH,
      chainId: activeNetwork.chainId
    }
  });

  useEffect(() => {
    if (loading) return;

    if (claimData?.tokensClaimedERC20S?.length) {
      setIsTokenClaimed(true);
    } else {
      setIsTokenClaimed(false);
    }
  }, [loading, JSON.stringify(claimData)]);

  return { tokenClaimLoading: loading, isTokenClaimed };
};

export default useFetchTokenClaim;
