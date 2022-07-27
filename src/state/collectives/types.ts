export type Collective = {
  id?: string;
  isActive: boolean;
  address: string;
  tokenName: string;
  tokenSymbol: string;
  pricePerNft: number;
  totalClaimed: number;
  totalUnclaimed: number;
  maxTotalSupply: number;
  tokenImage: string;
  inviteLink: string;
};

export const initialState = {
  adminCollectives: [],
  memberCollectives: []
};
