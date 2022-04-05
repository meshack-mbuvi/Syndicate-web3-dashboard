import { proxyGet } from '.';

// TODO:  Rename all transactions that point to only etherscan to dynamically use current chain explorer
export const getNativeTokenPrice = async (chainId: number) => {
  const result = await proxyGet(chainId, 'etherscan/api', {
    action: 'ethprice',
    module: 'stats'
  });

  return result.data.result.ethusd;
};

export const getExplorerTransactionHistory = async (
  address: string,
  contractaddress: string,
  chainId: number
) => {
  const result = await proxyGet(chainId, 'etherscan/api', {
    module: 'account',
    action: 'tokennfttx',
    address,
    contractaddress
  });

  return result.data.result;
};

export const getExplorerTokenTransactions = async (
  address: string,
  chainId: number
) => {
  const result = await proxyGet(chainId, 'etherscan/api', {
    module: 'account',
    action: 'tokentx',
    address
  });

  return result.data.result;
};

export const getNativeBalance = async (address: string, chainId: number) => {
  const result = await proxyGet(chainId, 'etherscan/api', {
    module: 'account',
    action: 'balance',
    tag: 'latest',
    address
  });

  return result.data.result;
};
