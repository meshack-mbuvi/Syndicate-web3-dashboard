import { ERC20TokenDefaultState } from "@/helpers/erc20TokenDetails";

export interface ERC20Token {
  name: string;
  owner: string;
  address: string;
  currentMintPolicyAddress?: string;
  totalSupply?: number;
  tokenDecimals: number;
  totalDeposits?: number;
  depositsEnabled: boolean;
  claimEnabled: boolean;
  symbol: string;
  startTime: number;
  endTime: number;
  memberCount: number;
  maxTotalDeposits: number;
  loading: boolean;
  maxMemberCount: number;
  maxTotalSupply: number;
  requiredToken;
  requiredTokenMinBalance;
  depositToken?: string;
  mintModule?: string;
}

export interface DepositDetails {
  mintModule: string;
  nativeDepositToken: boolean;
  depositToken: string;
  depositTokenSymbol: string;
  depositTokenLogo: string;
  depositTokenName: string;
  depositTokenDecimals: number;
}

export const initialState: {
  erc20Token: ERC20Token;
  depositDetails: DepositDetails;
  erc20TokenContract: any;
  depositTokenPriceInUSD?: number;
} = {
  erc20Token: ERC20TokenDefaultState,
  depositDetails: {
    mintModule: '',
    nativeDepositToken: false,
    depositToken: '',
    depositTokenSymbol: '',
    // default to USDC token to avoid error being thrown while loading the token
    depositTokenLogo: '/images/usdcicon.png',
    depositTokenName: '',
    depositTokenDecimals: 6
  },
  erc20TokenContract: null,
  depositTokenPriceInUSD: 0
};
