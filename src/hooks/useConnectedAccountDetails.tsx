import { CLUB_MEMBER_QUERY } from '@/graphql/queries';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { Status } from '@/state/wallet/types';
import { getWeiAmount } from '@/utils/conversions';
import { getFirstOrString } from '@/utils/stringUtils';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDemoMode } from './useDemoMode';

/**
 * Used to retrieve member ownership details for a given member address
 * and club address
 * @returns
 */
export function useConnectedAccountDetails(): {
  accountTokens: any;
  memberDeposits: any;
  memberOwnership: any;
  loadingMemberOwnership: any;
  refetchMemberData: any;
  startPolling: any;
  stopPolling: any;
} {
  const {
    web3Reducer: {
      web3: { account, activeNetwork, status }
    },
    erc20TokenSliceReducer: {
      erc20Token: { totalSupply, tokenDecimals, totalDeposits },
      depositDetails: {
        depositTokenDecimals,
        depositTokenSymbol,
        loading: loadingDepositsDetails
      }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();

  const clubAddress = getFirstOrString(router.query.clubAddress);

  const [accountTokens, setAccountTokens] = useState<string>('0');
  const [memberDeposits, setMemberDeposits] = useState<string>('0');
  const [memberOwnership, setMemberOwnership] = useState<string>('0');

  const isDemoMode = useDemoMode();

  const { loading, data, refetch, startPolling, stopPolling } = useQuery(
    CLUB_MEMBER_QUERY,
    {
      context: {
        clientName: SUPPORTED_GRAPHS.THE_GRAPH,
        chainId: activeNetwork.chainId
      },
      variables: {
        where: {
          memberAddress: account.toLocaleLowerCase()
        },
        syndicateDaOsWhere2: {
          syndicateDAO: clubAddress?.toLowerCase()
        }
      },
      // Avoid unnecessary calls when account/clubAddress is not defined
      skip:
        !account ||
        !activeNetwork.chainId ||
        !clubAddress ||
        isDemoMode ||
        status !== Status.CONNECTED
    }
  );

  useEffect(() => {
    if (isDemoMode) {
      setAccountTokens('3812');
      setMemberDeposits('3812');
      setMemberOwnership('31.6494');
      return;
    }

    if (loading || !data) return;

    // adding this block to reset values.
    // fixes an issue where member deposit data is not updated when switching from a member
    // with deposits to one with zero deposits.
    const resetMemberStats = (): void => {
      setAccountTokens('0');
      setMemberDeposits('0');
      setMemberOwnership('0');
    };

    if (!data.members.length) {
      resetMemberStats();
    }

    if (data.members.length) {
      const {
        members: [member]
      } = data;

      if (member) {
        const {
          syndicateDAOs: [clubMemberData]
        } = member;

        if (clubMemberData) {
          const {
            depositAmount = 0,
            tokens = 0,
            syndicateDAO: { totalSupply = 0 }
          } = clubMemberData;

          const clubTokens = getWeiAmount(tokens, tokenDecimals, false);
          const clubTotalSupply = getWeiAmount(
            totalSupply,
            tokenDecimals,
            false
          );

          setAccountTokens(clubTokens);
          setMemberDeposits(
            getWeiAmount(depositAmount, depositTokenDecimals, false)
          );
          setMemberOwnership(`${(100 * clubTokens) / clubTotalSupply}`);
        } else {
          resetMemberStats();
        }
      }
    } else {
      setAccountTokens('0');
      setMemberDeposits('0');
      setMemberOwnership('0');
    }
  }, [
    account,
    tokenDecimals,
    loading,
    clubAddress,
    totalSupply,
    totalDeposits,
    depositTokenDecimals,
    isDemoMode,
    depositTokenSymbol,
    JSON.stringify(data),
    loadingDepositsDetails
  ]);

  return {
    memberDeposits,
    accountTokens,
    memberOwnership,
    startPolling,
    stopPolling,
    refetchMemberData: refetch,
    loadingMemberOwnership: loading
  };
}
