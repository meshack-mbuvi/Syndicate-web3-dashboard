export interface IERC721MerkleProof {
  accountIndex: number;
  merkleProof: [];
  account: string;
  treeIndex: number;
}

export const initialState = {
  erc721MerkleProof: <IERC721MerkleProof>{},
  loading: true
};
