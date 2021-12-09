export interface MerkleProof {
  accountIndex: number;
  amount: string;
  merkleProof: [];
  account: string;
  _amount: string;
}

export const initialState = {
  myMerkleProof: <MerkleProof>{},
  loading: true,
};
