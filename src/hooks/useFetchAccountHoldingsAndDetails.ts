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
      // @ts-expect-error TS(2345): Argument of type 'string[] | undefined' is not assig... Remove this comment to see the full error message
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
    // @ts-expect-error TS(2322): Type 'AccountHoldings | undefined' is not assign... Remove this comment to see the full error message
    data: accountHoldings
  };
};
export default useFetchAccountHoldingsAndDetails;
