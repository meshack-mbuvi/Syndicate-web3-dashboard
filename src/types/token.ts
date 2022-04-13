export interface Token {
  name: string;
  address: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  chainId?: number;
  default?: boolean;
}

/**
 * @description matches the be token details response
 */
export interface TokenDetails {
  contractAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  logo?: string;
  description?: string;
}
