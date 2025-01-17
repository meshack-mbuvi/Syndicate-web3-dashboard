import { AxiosResponse } from 'axios';
import { proxyGet } from '.';

export async function getNativeTokenPrice(chainId: number): Promise<number> {
  const result: AxiosResponse<number> = await proxyGet(
    'token/native_price_usd',
    {
      chainId
    }
  );

  return result.data;
}

export const getTokenPrices = async (
  tokenAddresses: string,
  chainId: number
): Promise<ContractPriceResponse> => {
  const result: AxiosResponse<ContractPriceResponse> = await proxyGet(
    'token/price_usd',
    {
      tokenAddresses: tokenAddresses,
      chainId: chainId
    }
  );

  return result.data;
};

export async function getNftTransactionHistory(
  address: string,
  contractAddress: string,
  chainId: number
): Promise<ERC721Transaction[]> {
  const result: AxiosResponse<ERC721Transaction[]> = await proxyGet(
    'transaction/nfts',
    {
      address,
      contractAddress,
      chainId
    }
  );

  return result.data;
}

export async function getTokenTransactionHistory(
  address: string,
  chainId: number
): Promise<ERC20Transaction[]> {
  const result: AxiosResponse<ERC20Transaction[]> = await proxyGet(
    'transaction/tokens',
    {
      address,
      chainId
    }
  );

  return result.data;
}

export async function getNativeTokenBalance(
  address: string,
  chainId: number
): Promise<number> {
  const result: AxiosResponse<number> = await proxyGet('balance/native', {
    address,
    chainId
  });

  return result.data;
}

export interface ContractPriceResponse {
  [key: string]: { [key: string]: number | undefined };
}

export interface ERC20Transaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  transactinHash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}

export interface ERC721Transaction {
  blocknumber: string;
  timestamp: string;
  hash: string;
  nonce: string;
  blockhash: string;
  from: string;
  contractaddress: string;
  to: string;
  tokenID: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}
