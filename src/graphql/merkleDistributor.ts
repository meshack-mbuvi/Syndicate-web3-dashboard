import gql from 'graphql-tag';

// Queries

//ERC20 merkle
export const INDEX_AND_PROOF = gql`
  query getIndexAndProof($clubAddress: String!, $address: String!) {
    Financial_getIndexAndProof(clubAddress: $clubAddress, address: $address) {
      accountIndex
      amount
      merkleProof
      treeIndex
    }
  }
`;

// ERC721 merkle
export const ERC721_INDEX_AND_PROOF = gql`
  query getERC721IndexAndProof($clubAddress: String!, $address: String!) {
    Financial_getERC721IndexAndProof(
      clubAddress: $clubAddress
      address: $address
    ) {
      accountIndex
      merkleProof
      treeIndex
    }
  }
`;
