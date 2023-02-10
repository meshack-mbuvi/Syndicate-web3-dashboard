import { AccountHoldings } from '@/graphql/types';
import { AppState } from '@/state';
import { getAccountHoldings } from '@/utils/api';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useFetchAccountHoldingsAndDetails = (): {
  loading: boolean;
  data: AccountHoldings | undefined;
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
    const _tokens =
      activeModuleDetails?.activeMintModuleReqs?.requiredTokens?.map((token) =>
        token.toLocaleLowerCase()
      ) || [];

    void getAccountHoldings(_tokens, activeNetwork?.chainId, account)
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
