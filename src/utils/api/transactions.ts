import { proxyGet } from '.';
import { isDev } from '@/utils/environment';

enum ChainEnum {
  ETHEREUM = 1,
  RINKEBY = 4
}
const chainId = isDev ? ChainEnum.RINKEBY : ChainEnum.ETHEREUM;

export const getEthereumTokenPrice = async () => {
  const result = await proxyGet('etherscan/api', {
    action: 'ethprice',
    module: 'stats'
  });

  return result.data.result.ethusd;
};

export const getEtherscanTransactionHistory = async (
  address: string,
  contractaddress: string
) => {
  const result = await proxyGet('transaction/nfts', {
    address,
    contractaddress,
    chainId
  });

  return result.data;
};

export const getEtherscanTokenTransactions = async (address: string) => {
  const result = await proxyGet('transaction/tokens', {
    address,
    chainId
  });

  return result.data;
};

export const getEthBalance = async (address: string) => {
  const result = await proxyGet('etherscan/api', {
    module: 'account',
    action: 'balance',
    tag: 'latest',
    address
  });

  return result.data.result;
};
