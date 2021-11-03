export interface ERC20Token {
  name: string;
  owner: string;
  address: string;
  totalSupply: number;
  tokenDecimals: number;
  totalDeposits: number;
  depositsEnabled: boolean;
  depositToken: string;
  symbol: string;
  startTime: number;
  endTime: number;
  memberCount: number;
  maxTotalDeposits: number;
  accountClubTokens: number;
  connectedMemberDeposits: string | number;
  isOwner: boolean;
  loading: boolean;
  memberPercentShare: number;
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
      totalSupply: 0,
      tokenDecimals: 18, //default to 18
      totalDeposits: 0,
      connectedMemberDeposits: "0.0",
      symbol: "",
      startTime: 0,
      endTime: 0,
      memberCount: 0,
      maxTotalDeposits: 25000000,
      accountClubTokens: 0,
      isOwner: false,
      loading: false,
      memberPercentShare: 0,
      maxMemberCount: 0,
      maxTotalSupply: 0,
      requiredToken: "",
      requiredTokenMinBalance: "",
    },
    erc20TokenContract: null,
  };
