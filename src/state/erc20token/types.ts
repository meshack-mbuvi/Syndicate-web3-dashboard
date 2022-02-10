export interface ERC20Token {
  name: string;
  owner: string;
  address: string;
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
}

export interface DepositDetails {
  mintModule: string;
  ethDepositToken: boolean;
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
} = {
  erc20Token: {
    name: "",
    owner: "",
    address: "",
    depositsEnabled: false,
    claimEnabled: false,
    totalSupply: 0,
    tokenDecimals: 18, //default to 18
    totalDeposits: 0,
    symbol: "",
    startTime: 0,
    endTime: 0,
    memberCount: 0,
    maxTotalDeposits: 25000000,
    loading: false,
    maxMemberCount: 0,
    maxTotalSupply: 0,
    requiredToken: "",
    requiredTokenMinBalance: "",
  },
  depositDetails: {
    mintModule: "",
    ethDepositToken: false,
    depositToken: "",
    depositTokenSymbol: "",
    // default to USDC token to avoid error being thrown while loading the token
    depositTokenLogo: "/images/usdcicon.png",
    depositTokenName: "",
    depositTokenDecimals: 6,
  },
  erc20TokenContract: null,
};
