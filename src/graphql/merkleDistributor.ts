import gql from 'graphql-tag';

// Queries

//ERC20 merkle
export const INDEX_AND_PROOF = gql`
  query getIndexAndProof(
    $clubAddress: String!
    $address: String!
    $chainId: Int!
  ) {
    Financial_getIndexAndProof(
      clubAddress: $clubAddress
      address: $address
      chainId: $chainId
    ) {
      accountIndex
      amount
      merkleProof
      treeIndex
    }
  }
`;

// ERC721 merkle
export const ERC721_INDEX_AND_PROOF = gql`
  query getERC721IndexAndProof(
    $clubAddress: String!
    $address: String!
    $chainId: Int!
  ) {
    Financial_getERC721IndexAndProof(
      clubAddress: $clubAddress
      address: $address
      chainId: $chainId
    ) {
      accountIndex
      merkleProof
      treeIndex
    }
  }
`;
