import { useQuery as useApolloQuery } from '@apollo/client';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { ethers, utils } from 'ethers';
import { useSelector } from 'react-redux';

import { GAS_RATE } from '@/graphql/backend_queries';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';

interface UseGasPriceParams {
  enabled: boolean;
}

interface UseGasPriceData {
  currentGasInGwei: string;
  currentGasInUSD: number | null;
  nativeTokenPriceInUSD: number | null;
}

export default function useGasPrice(
  params: UseGasPriceParams
): UseQueryResult<UseGasPriceData | null, Error> {
  const { enabled } = params;
  const { web3Reducer } = useSelector((state: AppState) => state);
  const {
    web3: { activeNetwork }
  } = web3Reducer;
  // Create a provider based off the rpc URL in our networks file
  const provider = new ethers.providers.JsonRpcProvider(activeNetwork.rpcUrl);

  const { data: gasData } = useApolloQuery<{
    gas: {
      chainId: string;
      unitPrice: string;
      nativeToken: {
        price: {
          usd: number;
        };
      };
    };
  }>(GAS_RATE, {
    variables: {
      chainId: activeNetwork.chainId
    },
    context: {
      clientName: SUPPORTED_GRAPHS.BACKEND,
      chainId: activeNetwork.chainId
    },
    skip: !activeNetwork.chainId
  });

  const usdGasPrice = gasData?.gas.nativeToken.price.usd as number;

  console.log(usdGasPrice);

  return useQuery({
    queryKey: ['gasPrice'],
    queryFn: async () => {
      try {
        // Run the function to get the current gas data
        const feeData = await provider.getFeeData();

        const gasPrice = feeData?.lastBaseFeePerGas;

        // In the case where feeData is null, we can't get the gas price, so we return
        if (!gasPrice) {
          return null;
        }

        return {
          currentGasInGwei: utils.formatUnits(gasPrice, 'gwei').toString(),
          currentGasInUSD: usdGasPrice
            ? usdGasPrice * parseFloat(utils.formatEther(gasPrice.toNumber()))
            : null,
          nativeTokenPriceInUSD: usdGasPrice
        };
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    enabled: Boolean(enabled && usdGasPrice),
    retry: 1,
    // Data is fresh for 60 seconds, assuming the query key is the same
    staleTime: 1000 * 60
  });
}
