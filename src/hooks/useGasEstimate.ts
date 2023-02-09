import { useQuery as useApolloQuery } from '@apollo/client';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { ethers, utils } from 'ethers';
import { useSelector } from 'react-redux';

import { ContractBase } from '@/ClubERC20Factory/ContractBase';
import { GAS_RATE } from '@/graphql/backend_queries';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';

interface UseGasEstimateData {
  isValidTx: boolean;
  gasEstimate:
    | {
        gasUsed: string;
        currentGasInGwei: string;
        gasEstimateCostInGwei: string;
        gasEstimateCostInUSD: number | null;
        nativeTokenPriceInUSD: number | null;
      }
    | undefined;
}

interface UseGasEstimateParams {
  contract: ContractBase;
  functionName: string;
  // @DEV: We have to explicitly set any here as we cant tell ahead of time what the function ABI argument types will be, when we migrate to wagmi this will be solved as their hooks are typed.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args?: any[];
  value?: string;
  withFiat?: boolean;
}

export default function useGasEstimate(
  params: UseGasEstimateParams
): UseQueryResult<UseGasEstimateData, Error> {
  const { contract, functionName, args, value, withFiat } = params;
  const { web3Reducer } = useSelector((state: AppState) => state);
  const {
    web3: { activeNetwork, account }
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
    skip: !withFiat || !activeNetwork.chainId
  });

  const usdGasPrice = gasData?.gas.nativeToken.price.usd as number;

  return useQuery({
    queryKey: [
      'gasEstimate',
      account,
      activeNetwork.chainId,
      contract?.address,
      contract?.abiItem,
      functionName,
      args,
      value
    ],
    queryFn: async () => {
      // Create contract instance, pass it the contract address and ABI from the ContractsBase class
      const contractInstance = new ethers.Contract(
        contract.address,
        contract.abiItem as ethers.ContractInterface,
        provider
      );
      try {
        // Run both functions simultaneously, then destructure the results
        const [gasEstimate, feeData] = await Promise.all([
          // Estimate gas for the transaction and override the address for the current logged in account and pass in a value if it exists
          contractInstance.estimateGas[functionName](...(args ?? []), {
            from: account,
            value: value ? utils.parseEther(value) : undefined
          }),
          // Call the gas price function on the provider
          provider.getFeeData()
        ]);

        const gasPrice = feeData?.lastBaseFeePerGas;

        // In the case where feeData is null, we can't get the gas price, so we return early, but the tx is still valid (we just can't get the gas price)
        if (!gasPrice) {
          return {
            isValidTx: true,
            gasEstimate: null
          };
        }

        return {
          isValidTx: true,
          gasEstimate: {
            gasUsed: gasEstimate.toString(),
            currentGasInGwei: utils.formatUnits(gasPrice, 'gwei').toString(),
            gasEstimateCostInGwei: utils
              .formatUnits(gasEstimate.mul(gasPrice), 'gwei')
              .toString(),

            gasEstimateCostInUSD: usdGasPrice
              ? usdGasPrice *
                parseFloat(utils.formatEther(gasEstimate.mul(gasPrice)))
              : null,
            nativeTokenPriceInUSD: usdGasPrice
          }
        };
      } catch (error) {
        console.log(error);
        return {
          isValidTx: false,
          gasEstimate: null
        };
      }
    },
    enabled: Boolean(
      (args ? args.length > 0 : true) &&
        activeNetwork &&
        account.length > 0 &&
        contract &&
        functionName &&
        (withFiat ? gasData : true)
    ),
    retry: 1,
    // Data is fresh for 60 seconds, assuming the query key is the same
    staleTime: 1000 * 60
  });
}
