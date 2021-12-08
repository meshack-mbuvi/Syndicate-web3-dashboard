import gql from "graphql-tag";

// Queries

export const INDEX_AND_PROOF = gql`
  query getIndexAndProof($clubAddress: String!, $address: String!) {
    Financial_getIndexAndProof(clubAddress: $clubAddress, address: $address) {
      accountIndex
      amount
      merkleProof
    }
  }
`;
