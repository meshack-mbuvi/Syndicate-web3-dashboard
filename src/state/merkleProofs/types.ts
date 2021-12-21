export interface MerkleProof {
  accountIndex: number;
  amount: string;
  merkleProof: [];
  account: string;
  treeIndex: number;
  _amount: string;
}

export const initialState = {
  myMerkleProof: <MerkleProof>{},
  loading: true,
};
