import { CLUB_MEMBER_QUERY } from '@/graphql/queries';
import { AppState } from '@/state';
import { setConnectedMember } from '@/state/connectMember';
import { getWeiAmount } from '@/utils/conversions';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDemoMode } from './useDemoMode';

/**
 * Used to retrieve member ownership details for a given member address
 * and club address
 * @returns
 */
export function useAccountTokens(): {
  accountTokens;
  memberPercentShare;
  memberDeposits;
  memberOwnership;
  loadingMemberOwnership;
  refetchMemberData;
  startPolling;
  stopPolling;
} {
  const {
    web3Reducer: {
      web3: { account, activeNetwork, web3 }
    },
    erc20TokenSliceReducer: {
      erc20Token: { address, totalSupply, tokenDecimals, totalDeposits },
      depositDetails: { nativeDepositToken, depositTokenDecimals }
    }
  } = useSelector((state: AppState) => state);
  const [accountTokens, setAccountTokens] = useState<string>('0');
  const [memberDeposits, setMemberDeposits] = useState<string>('0');
  const [memberOwnership, setMemberOwnership] = useState<string>('0');

  const isDemoMode = useDemoMode();

  const { loading, data, refetch, startPolling, stopPolling } = useQuery(
    CLUB_MEMBER_QUERY,
    {
      context: { clientName: 'theGraph', chainId: activeNetwork.chainId },
      variables: {
        where: {
          memberAddress: account.toLocaleLowerCase()
        },
        syndicateDaOsWhere2: {
          syndicateDAO: address.toLowerCase()
        }
      },
      // Avoid unnecessary calls when account/clubAddress is not defined
      skip: !account || !activeNetwork.chainId || !address || isDemoMode
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
    const resetMemberStats = () => {
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
            ownershipShare = 0,
            tokens = 0
          } = clubMemberData;

          setAccountTokens(getWeiAmount(web3, tokens, tokenDecimals, false));
          setMemberDeposits(
            getWeiAmount(web3, depositAmount, depositTokenDecimals, false)
          );
          // this is a percentage conversion with a base of 10000, 1% == 10000
          setMemberOwnership(`${+ownershipShare / 10000}`);
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
    address,
    totalSupply,
    totalDeposits,
    depositTokenDecimals,
    isDemoMode,
    depositTokenDecimals,
    JSON.stringify(data)
  ]);

  useEffect(() => {
    if (activeNetwork.chainId) {
      refetch();
    }
  }, [totalSupply, totalDeposits, account, activeNetwork.chainId]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setConnectedMember({
        loading,
        depositAmount: `${
          ethDepositToken
            ? parseFloat((Number(memberDeposits) * 10000).toString())
            : memberDeposits
        }`
      })
    );
    return () => {
      dispatch(setConnectedMember({ depositAmount: '', loading: false }));
    };
  }, [loading, memberDeposits]);

  return {
    loadingMemberOwnership: loading,
    accountTokens,
    memberPercentShare: memberOwnership,
    memberDeposits: nativeDepositToken
      ? parseFloat(
          (
            Number(memberDeposits) * activeNetwork.nativeCurrency.exchangeRate
          ).toString()
        )
      : memberDeposits,
    memberOwnership,
    refetchMemberData: refetch,
    startPolling,
    stopPolling
  };
}
