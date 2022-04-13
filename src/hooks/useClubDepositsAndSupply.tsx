import { SINGLE_CLUB_DETAILS } from '@/graphql/queries';
import { AppState } from '@/state';
import { getWeiAmount } from '@/utils/conversions';
import {
  MOCK_END_TIME,
  MOCK_START_TIME,
  MOCK_TOTALDEPOSITS,
  MOCK_TOTALSUPPLY
} from '@/utils/mockdata';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAccountTokens } from './useAccountTokens';
import { useDemoMode } from './useDemoMode';

/**
 * Retrieves club total deposits and total supply from the thegraph.
 * NOTE: More fields like owner address can also be retrieved if needed.
 * @param contractAddress
 * @returns
 */
export function useClubDepositsAndSupply(contractAddress: string): {
  refetch;
  totalDeposits;
  totalSupply;
  startTime;
  endTime;
  loadingClubDeposits;
} {
  const {
    erc20TokenSliceReducer: {
      erc20Token,
      depositDetails: { depositTokenDecimals }
    }
  } = useSelector((state: AppState) => state);

  const { tokenDecimals } = erc20Token;

  const [totalDeposits, setTotalDeposits] = useState('');
  const [totalSupply, setTotalSupply] = useState('0');
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [loadingClubDeposits, setLoadingClubDeposits] = useState(true);

  const { isReady } = useRouter();
  const isDemoMode = useDemoMode();

  // SINGLE_CLUB_DETAILS
  const { loading, data, refetch } = useQuery(SINGLE_CLUB_DETAILS, {
    variables: {
      where: {
        contractAddress: contractAddress?.toLocaleLowerCase() || ''
      }
    },
    // Avoid unnecessary calls when contractAddress is not defined or in demo mode
    skip: !contractAddress || isDemoMode
  });

  const { memberDeposits, accountTokens } = useAccountTokens();

  /**
   * Retrieve totalDeposits,totalSupply from the thegraph
   *
   * Also,whenever connected wallet tokens/deposits change, refetch club details
   */
  useEffect(() => {
    if (isDemoMode) {
      setTotalSupply(MOCK_TOTALSUPPLY);
      setTotalDeposits(MOCK_TOTALDEPOSITS);
      setStartTime(MOCK_START_TIME);
      setEndTime(MOCK_END_TIME);
      setLoadingClubDeposits(false);
      return;
    }

    if (loading || !data || erc20Token?.loading) return;

    const {
      syndicateDAOs: [syndicateDAO]
    } = data || {};

    const { totalDeposits, totalSupply, startTime, endTime } =
      syndicateDAO || {};

    setTotalSupply(getWeiAmount(totalSupply, tokenDecimals || 18, false));
    setTotalDeposits(getWeiAmount(totalDeposits, depositTokenDecimals, false));
    setStartTime(+startTime * 1000);
    setEndTime(+endTime * 1000);
    setLoadingClubDeposits(false);
  }, [
    data,
    loading,
    tokenDecimals,
    erc20Token.loading,
    isReady,
    memberDeposits,
    accountTokens,
    depositTokenDecimals
  ]);

  return {
    totalDeposits,
    totalSupply,
    startTime,
    endTime,
    loadingClubDeposits: loading || loadingClubDeposits,
    refetch
  };
}
