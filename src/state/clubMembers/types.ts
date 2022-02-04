export interface clubMember {
  depositAmount: string;
  memberAddress: string;
}

export const initialState = {
  clubMembers: [],
  loadingClubMembers: false
};
