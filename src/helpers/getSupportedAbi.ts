import { isAddress } from 'ethers/lib/utils';
import { CONTRACT_ADDRESSES } from '@/Networks';
import { SUPPORTED_ABIS } from '@/Networks/supportedAbis';
import { AbiItem } from 'web3-utils';

export enum SupportedAbiError {
  NO_CHAIN_ID = 'NO_CHAIN_ID',
  INVALID_CONTRACT = 'INVALID_CONTRACT',
  CONTRACT_NOT_FOUND = 'CONTRACT_NOT_FOUND',
  ABI_NOT_FOUND = 'ABI_NOT_FOUND'
}

export interface SupportedAbi {
  contractName: string;
  abi: AbiItem[];
}

const getSupportedAbi = (
  contractAddress: string,
  chainId: number
): SupportedAbi | SupportedAbiError => {
  if (!chainId) {
    return SupportedAbiError.NO_CHAIN_ID;
  }
  if (!contractAddress || !isAddress(contractAddress))
    return SupportedAbiError.INVALID_CONTRACT;

  const activeNetworkContracts =
    CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
  const activeContractAddresses = Object.entries(activeNetworkContracts);
  for (let i = 0; i < activeContractAddresses.length; i++) {
    if (
      activeContractAddresses[i][1]?.toLowerCase() ==
      contractAddress.toLowerCase()
    ) {
      const abi = SUPPORTED_ABIS[activeContractAddresses[i][0]];
      if (!abi) {
        return SupportedAbiError.ABI_NOT_FOUND;
      } else {
        return { abi, contractName: activeContractAddresses[i][0] };
      }
    }
  }
  return SupportedAbiError.CONTRACT_NOT_FOUND;
};

export default getSupportedAbi;
