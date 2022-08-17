export enum TokenMediaType {
  ANIMATION = 'ANIMATION',
  IMAGE = 'IMAGE'
}

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
  tokenMedia: string;
  tokenMediaType: TokenMediaType;
  inviteLink: string;
};

export const initialState = {
  adminCollectives: [],
  memberCollectives: []
};
