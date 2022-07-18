import { ERC20TokenDefaultState } from '@/helpers/erc20TokenDetails';

export interface ERC20Token {
  isValid?: boolean;
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
  loading: boolean;
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
    depositTokenLogo: '/images/usdcIcon.svg',
    depositTokenName: '',
    depositTokenDecimals: 6,
    loading: true
  },
  erc20TokenContract: null,
  depositTokenPriceInUSD: 0
};
