import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

import { AppState } from '@/state';

type UseRugRadioBalanceData = string;

interface UseRugRadioBalanceParams {
  account: string | null;
}

export default function useRugRadioBalance(
  params: UseRugRadioBalanceParams
): UseQueryResult<UseRugRadioBalanceData, Error> {
  const { account } = params;
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
    queryKey: ['rugRadioBalance', activeNetwork.chainId, account],
    queryFn: async () => {
      try {
        const dataResult = await RugToken.balanceOf(account as string);

        return dataResult;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    enabled: Boolean(account),
    retry: 1
  });
}
