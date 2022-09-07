import { AppState } from '@/state';
import { useSelector } from 'react-redux';
import { AccountHoldings } from '@/graphql/types';
import { useCallback, useEffect, useState } from 'react';
import { getAccountHoldings } from '@/utils/api';

export const useFetchAccountHoldingsAndDetails = (): {
  loading: boolean;
  data: AccountHoldings;
} => {
  const {
    web3Reducer: {
      web3: { account, activeNetwork }
    },
    erc20TokenSliceReducer: { activeModuleDetails }
  } = useSelector((state: AppState) => state);

  const [loading, setLoading] = useState(false);
  const [accountHoldings, setAccountHoldings] = useState<AccountHoldings>();

  const fetchHoldings = useCallback(() => {
    setLoading(true);
    getAccountHoldings(
      activeModuleDetails?.activeMintModuleReqs?.requiredTokens?.map((token) =>
        token.toLocaleLowerCase()
      ),
      activeNetwork?.chainId,
      account
    )
      .then((res) => {
        setAccountHoldings(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [
    account,
    activeModuleDetails?.activeMintModuleReqs?.requiredTokens,
    activeNetwork?.chainId
  ]);

  useEffect(() => {
    void fetchHoldings();
  }, [fetchHoldings]);

  return {
    loading,
    data: accountHoldings
  };
};
export default useFetchAccountHoldingsAndDetails;
