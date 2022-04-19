export interface TokenClaimed {
  id: string;
  claimant: string;
  club: string;
  treeIndex: string;
  amount: string;
  index: string;
  createdAt: string;
  claimed: boolean;
}

export const initialState = {
  isTokenClaimed: <TokenClaimed>{},
  loading: true
};
