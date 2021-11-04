export interface clubERC20 {
  createdAt;
  endTime: number;
  maxMemberCount: number;
  maxTotalSupply: string;
  requiredToken;
  requiredTokenMinBalance;
  startTime;
  contractAddress;
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
  clubERC20s: [],
};
