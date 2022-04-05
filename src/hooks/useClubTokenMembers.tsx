import { CLUB_TOKEN_MEMBERS } from '@/graphql/queries';
import { AppState } from '@/state';
import {
  setClubMembers,
  setLoadingClubMembers,
  clearClubMembers
} from '@/state/clubMembers';
import { getWeiAmount } from '@/utils/conversions';
import { mockClubMembers } from '@/utils/mockdata';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDemoMode } from './useDemoMode';

const useClubTokenMembers = () => {
  const dispatch = useDispatch();

  const {
    web3Reducer: { web3 },
    erc20TokenSliceReducer: {
      erc20Token: { symbol, tokenDecimals, totalSupply },
      depositDetails: { depositTokenDecimals }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();
  const { clubAddress } = router.query;
  const isDemoMode = useDemoMode();

  const { account, activeNetwork } = web3;

  // Retrieve syndicates that I manage
  const {
    loading: loadingClubMembers,
    refetch,
    data
  } = useQuery(CLUB_TOKEN_MEMBERS, {
    variables: {
      where: {
        contractAddress: clubAddress?.toString().toLocaleLowerCase()
      }
    },
    context: { clientName: 'theGraph', chainId: activeNetwork.chainId },
    skip: !clubAddress || isDemoMode || !activeNetwork.chainId
  });

  const processMembers = (members) => {
    if (!members || !members.length) {
      return;
    }

    const clubMembers = members.map(
      ({
        depositAmount,
        ownershipShare,
        tokens,
        member: { memberAddress }
      }) => {
        return {
          memberAddress,
          ownershipShare: parseInt(ownershipShare) / 10000,
          symbol,
          clubTokens: getWeiAmount(tokens, tokenDecimals, false),
          totalSupply: totalSupply,
          depositAmount: getWeiAmount(
            depositAmount,
            depositTokenDecimals,
            false
          )
        };
      }
    );

    dispatch(setClubMembers(clubMembers));
  };

  useEffect(() => {
    if (router.isReady && activeNetwork.chainId) {
      refetch();
    }
  }, [router.isReady, account, activeNetwork.chainId, totalSupply]);

  useEffect(() => {
    if (loadingClubMembers) {
      dispatch(setLoadingClubMembers(true));
    } else if (isDemoMode) {
      processMembers(mockClubMembers);
    } else {
      // remove mock data from the redux store
      dispatch(clearClubMembers());

      processMembers(data?.syndicateDAOs?.[0]?.members);
      dispatch(setLoadingClubMembers(false));
    }
  }, [
    JSON.stringify(data?.syndicateDAOs?.[0]?.members),
    loadingClubMembers,
    clubAddress,
    account
  ]);
};

export default useClubTokenMembers;
