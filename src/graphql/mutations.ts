import { gql } from '@apollo/client';

export const ANNOTATE_TRANSACTIONS = gql`
  mutation annotateTransactions(
    $transactionAnnotationList: [Financial_TransactionAnnotationInput]
  ) {
    Financial_annotateTransactions(
      transactionAnnotationList: $transactionAnnotationList
    )
  }
`;

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
