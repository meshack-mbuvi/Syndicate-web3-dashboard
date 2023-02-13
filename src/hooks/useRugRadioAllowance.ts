import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

import { AppState } from '@/state';

type UseRugRadioAllowanceData = string;

interface UseRugRadioAllowanceParams {
  account: string | null;
  spender: string | null;
  enabled: boolean;
}

export default function useRugRadioAllowance(
  params: UseRugRadioAllowanceParams
): UseQueryResult<UseRugRadioAllowanceData, Error> {
  const { account, spender, enabled } = params;
  const {
    web3Reducer,
    initializeContractsReducer: {
      syndicateContracts: { RugToken }
    }
  } = useSelector((state: AppState) => state);
  const {
    web3: { activeNetwork }
  } = web3Reducer;

  return useQuery({
    queryKey: ['rugRadioAllowance', activeNetwork.chainId, account, spender],
    queryFn: async () => {
      try {
        const dataResult: string = (await RugToken.allowance(
          account as string,
          spender as string
        )) as string;

        return dataResult;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    enabled: Boolean(account && enabled),
    retry: 1
  });
}
