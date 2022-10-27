export interface IClubERC20 {
  depositAmount?: string;
  address: string;
  clubName: string;
  status: string;
  ownershipShare?: number;
  depositERC20TokenSymbol: string;
  depositTokenLogo: string;
  membersCount: number;
  totalDeposits: number;
  memberDeposits?: number;
  isOwner: boolean;
  clubSymbol: string;
}

export interface IMemberResponse {
  syndicateDAOs: {
    depositAmount: string;
    syndicateDAO: IGraphClubsResponse;
  }[];
}

export interface IGraphClubsResponse {
  contractAddress: string;
  members: any;
  ownerAddress: string;
  totalDeposits: string;
  totalSupply: string;
  startTime: string;
  endTime: string;
  maxMemberCount?: string;
  requiredToken?: string;
  requiredTokenMinBalance?: string;
  depositAmount: string;
  maxTotalSupply: string;
}
