export interface clubMember {
  depositAmount: string;
  memberAddress: string;
  clubTokens: string;
  ownershipShare: number;
  symbol: string;
  totalSupply: string;
}

export const initialState = {
  clubMembers: [
    {
      depositAmount: '0',
      memberAddress: '',
      clubTokens: '0',
      ownershipShare: 0,
      symbol: '',
      totalSupply: '0'
    }
  ],
  loadingClubMembers: false
};
