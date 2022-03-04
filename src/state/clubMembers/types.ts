export interface clubMember {
  depositAmount: string;
  memberAddress: string;
}

export const initialState = {
  clubMembers: [{ memberAddress: "" }],
  loadingClubMembers: false,
};
