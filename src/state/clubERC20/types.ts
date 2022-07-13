export interface clubERC20 {
  createdAt?;
  endTime: number;
  maxMemberCount: number;
  maxTotalSupply: string;
  requiredToken;
  requiredTokenMinBalance;
  startTime;
  contractAddress;
  address?;
  ownerAddress;
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
