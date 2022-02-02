export interface ERC20Token {
  name: string;
  owner: string;
  address: string;
  totalSupply?: number;
  tokenDecimals: number;
  totalDeposits?: number;
  depositsEnabled: boolean;
  claimEnabled: boolean;
  depositToken: string;
  mintModule: string;
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

export const initialState: { erc20Token: ERC20Token; erc20TokenContract: any } =
  {
    erc20Token: {
      name: "",
      owner: "",
      address: "",
      depositToken: "",
      depositsEnabled: false,
      claimEnabled: false,
      totalSupply: 0,
      mintModule: "",
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
    erc20TokenContract: null,
  };
