import { AppState } from '@/state';
import { useSelector } from 'react-redux';
import { AccountHoldings } from '@/graphql/types';
import { useCallback, useEffect, useState } from 'react';
import { getAccountHoldings } from '@/utils/api';

export const useFetchTokenBalance = (
  tokenAddress: string
): {
  accountHoldingsLoading: boolean;
  accountHoldings: AccountHoldings | undefined;
} => {
  const {
    web3Reducer: {
      web3: { account, activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const [accountHoldingsLoading, setAccountHoldingsLoading] = useState(false);
  const [accountHoldings, setAccountHoldings] = useState<
    AccountHoldings | undefined
  >();

  const fetchHoldings = useCallback(() => {
    setAccountHoldingsLoading(true);
    getAccountHoldings([tokenAddress], activeNetwork?.chainId, account)
      .then((res) => {
        setAccountHoldings(res.data.data);
        setAccountHoldingsLoading(false);
      })
      .catch(() => setAccountHoldingsLoading(false));
  }, [account, tokenAddress, activeNetwork?.chainId]);

  useEffect(() => {
    void fetchHoldings();
  }, [fetchHoldings]);

  return {
    accountHoldingsLoading,
    accountHoldings
  };
};
export default useFetchTokenBalance;
