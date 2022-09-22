import { CLUB_TOKEN_MEMBERS } from '@/graphql/queries';
import { AppState } from '@/state';
import { getWeiAmount } from '@/utils/conversions';
import { mockClubMembers } from '@/utils/mockdata';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDemoMode } from './useDemoMode';

type clubMember = {
  depositAmount: string;
  memberAddress: string;
  clubTokens: string;
  ownershipShare: number;
  symbol: string;
  totalSupply: string;
};

const useClubTokenMembers = (): {
  clubMembers: clubMember[];
  isFetchingMembers: boolean;
} => {
  const {
    web3Reducer: { web3: web3Instance },
    erc20TokenSliceReducer: {
      erc20Token: { symbol, tokenDecimals, totalSupply },
      depositDetails: { depositTokenDecimals, nativeDepositToken }
    }
  } = useSelector((state: AppState) => state);

  const [clubMembers, setClubMembers] = useState<clubMember[]>([]);
  const [isFetchingMembers, setIsFetchingMembers] = useState(true);

  const router = useRouter();
  const { clubAddress } = router.query;
  const isDemoMode = useDemoMode();

  const { account, activeNetwork, web3 } = web3Instance;

  // Retrieve syndicates that I manage
  const { loading, refetch, data } = useQuery(CLUB_TOKEN_MEMBERS, {
    variables: {
      where: {
        contractAddress: clubAddress?.toString().toLowerCase()
      }
    },
    context: { clientName: 'theGraph', chainId: activeNetwork.chainId },
    skip: !clubAddress || isDemoMode || !activeNetwork.chainId
  });

  const processMembers = (syndicate) => {
    if (!syndicate || !syndicate?.members || !syndicate.members.length) {
      return;
    }

    const clubTotalSupply = getWeiAmount(
      web3,
      syndicate.totalSupply,
      tokenDecimals,
      false
    );

    const _clubMembers = syndicate.members.map(
      ({ depositAmount, tokens, member: { memberAddress } }) => {
        const clubTokens = getWeiAmount(web3, tokens, tokenDecimals, false);
        return {
          memberAddress,
          ownershipShare: (100 * clubTokens) / clubTotalSupply,
          symbol,
          clubTokens,
          totalSupply: totalSupply,
          depositAmount: getWeiAmount(
            web3,
            depositAmount,
            depositTokenDecimals,
            false
          )
        };
      }
    );

    setClubMembers(_clubMembers);
    setIsFetchingMembers(false);
  };

  useEffect(() => {
    if (router.isReady && activeNetwork.chainId) {
      refetch();
    }
  }, [
    router.isReady,
    account,
    activeNetwork.chainId,
    totalSupply,
    nativeDepositToken
  ]);

  useEffect(() => {
    if (isDemoMode) {
      processMembers(mockClubMembers);
      setIsFetchingMembers(false);
    }

    if (loading) return;

    if (data?.syndicateDAOs?.[0]?.members?.length) {
      setClubMembers([]);

      processMembers(data?.syndicateDAOs?.[0]);
    } else {
      setClubMembers([]);
      setIsFetchingMembers(false);
    }
  }, [
    JSON.stringify(data?.syndicateDAOs?.[0]),
    clubAddress,
    account,
    nativeDepositToken,
    loading
  ]);

  return { clubMembers, isFetchingMembers };
};

export default useClubTokenMembers;
