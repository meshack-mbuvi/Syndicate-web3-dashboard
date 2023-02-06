import { gql } from '@apollo/client';

export const SET_MEMBER_SIGN_STATUS = gql`
  mutation Financial_signLegalDocuments(
    $clubAddress: String!
    $address: String!
    $hasSigned: Boolean!
  ) {
    Financial_signLegalDocuments(
      clubAddress: $clubAddress
      address: $address
      hasSigned: $hasSigned
    )
  }
`;

export const ANNOTATE_TRANSACTIONS = gql`
  mutation LegacyAnnotateTransactions(
    $input: String!
    $chainId: Int
    $transactionAnnotationList: [TransactionAnnotationInput]!
  ) {
    legacyAnnotateTransactions(
      input: $input
      chainId: $chainId
      transactionAnnotationList: $transactionAnnotationList
    ) {
      success
    }
  }
`;

export const CREATE_BASIC_MERKLE_TREE_MUTATION = gql`
  mutation createBasicMerkleTree($accounts: [String!]!) {
    createBasicMerkleTree(accounts: $accounts) {
      merkleRoot
    }
  }
`;
