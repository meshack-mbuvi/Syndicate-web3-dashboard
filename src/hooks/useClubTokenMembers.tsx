import { CLUB_TOKEN_MEMBERS } from '@/graphql/queries';
import { AppState } from '@/state';
import {
  clearClubMembers,
  setClubMembers,
  setLoadingClubMembers
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
    web3Reducer: { web3: web3Instance },
    erc20TokenSliceReducer: {
      erc20Token: { symbol, tokenDecimals, totalSupply },
      depositDetails: { depositTokenDecimals, nativeDepositToken }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();
  const { clubAddress } = router.query;
  const isDemoMode = useDemoMode();

  const { account, activeNetwork, web3 } = web3Instance;

  // Retrieve syndicates that I manage
  const {
    loading: loadingClubMembers,
    refetch,
    data
  } = useQuery(CLUB_TOKEN_MEMBERS, {
    variables: {
      where: {
        contractAddress: clubAddress?.toString().toLowerCase()
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
          ownershipShare:
            parseInt(ownershipShare) /
            activeNetwork.nativeCurrency.exchangeRate,
          symbol,
          clubTokens: getWeiAmount(web3, tokens, tokenDecimals, false),
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

    dispatch(setClubMembers(clubMembers));
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
    account,
    nativeDepositToken
  ]);
};

export default useClubTokenMembers;
