export interface ERC721laimed {
  id: string;
  claimant: string;
  token: string;
  treeIndex: string;
  index: string;
  claimed: boolean;
}

export const initialState: { erc721Claimed: ERC721laimed; loading: boolean } = {
  erc721Claimed: {
    id: '',
    claimant: '',
    token: '',
    treeIndex: '',
    index: '',
    claimed: false
  },
  loading: true
};
