export interface Token {
  name: string;
  address: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  chainId?: number;
  default?: boolean;
}
