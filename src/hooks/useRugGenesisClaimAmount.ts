import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

import { AppState } from '@/state';

type UseRugGenesisClaimAmountData = string[];

interface UseRugGenesisClaimAmountParams {
  tokenIDs: string[] | null;
  enabled: boolean;
}

export default function useRugGenesisClaimAmount(
  params: UseRugGenesisClaimAmountParams
): UseQueryResult<UseRugGenesisClaimAmountData, Error> {
  const { tokenIDs, enabled } = params;
  const {
    web3Reducer,
    initializeContractsReducer: {
      syndicateContracts: { rugPFPClaimModule }
    }
  } = useSelector((state: AppState) => state);
  const {
    web3: { activeNetwork }
  } = web3Reducer;

  return useQuery({
    queryKey: ['rugGenesisClaimAmount', activeNetwork.chainId, tokenIDs],
    queryFn: async () => {
      try {
        if (tokenIDs === null) return null;
        const dataResult = await rugPFPClaimModule?.getMintsRemainingPerNFTs(
          tokenIDs
        );

        return dataResult;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    enabled: Boolean(enabled && tokenIDs && tokenIDs.length > 0),
    retry: 1
  });
}
