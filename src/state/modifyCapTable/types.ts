export interface SelectedMember {
  memberAddress: string;
  ownershipShare: string;
  clubTokens: string;
}

export const initialState: { memberToUpdate: SelectedMember } = {
  memberToUpdate: {
    memberAddress: "",
    clubTokens: "",
    ownershipShare: "",
  },
};
