export interface clubERC20 {
  createdAt?: any;
  endTime: number;
  maxMemberCount: number;
  maxTotalSupply: string;
  requiredToken: any;
  requiredTokenMinBalance: any;
  startTime: any;
  contractAddress: any;
  address?: any;
  ownerAddress: any;
  depositAmount: string;
  totalDeposits: string;
  membersCount: number;
  distributions: string;
  myWithdrawals: string;
  isOwner: boolean;
  depositERC20TokenSymbol: string;
}

export const initialState = {
  otherClubERC20s: [],
  myClubERC20s: [],
  newClub: null,
  loading: true
};
