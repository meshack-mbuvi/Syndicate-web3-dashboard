import { DocumentNode, gql } from '@apollo/client';

export const MEMBER_SIGNED_QUERY = gql`
  query MemberHasSigned($clubAddress: String!, $address: String!) {
    Financial_memberSigned(clubAddress: $clubAddress, address: $address)
  }
`;

export const GAS_RATE = gql`
  query GasRate($chainId: Int!) {
    gas(chainId: $chainId) {
      chainId
      unitPrice
      nativeToken {
        price {
          usd
        }
      }
    }
  }
`;

export const LEGACY_TRANSACTIONS_QUERY = gql`
  query GetLegacyTransactions(
    $chainId: Int!
    $input: String!
    $order: Order
    $limit: Int
    $where: TransactionEventSearchFilter
    $offset: Int
  ) {
    legacyTransactionEvents(
      chainId: $chainId
      input: $input
      order: $order
      limit: $limit
      where: $where
      offset: $offset
    ) {
      events {
        chainId
        hash
        blockNumber
        timestamp
        ownerAddress
        contractAddress
        syndicateEvents {
          id
          eventType
          transactionId
          distributionBatch
        }
        annotation {
          chainId
          transactionId
          syndicateAddress
          memo
          companyName
          transactionCategory
          roundCategory
          sharesAmount
          tokenAmount
          equityStake
          acquisitionDate
          preMoneyValuation
          postMoneyValuation
          fromLabel
          toLabel
          annotationMetadata
          createdAt
          updatedAt
        }
        transfers {
          chainId
          hash
          from
          to
          contractAddress
          type
          value
          tokenName
          tokenSymbol
          tokenDecimal
          tokenLogo
        }
      }
    }
  }
`;

export const TOKEN_DETAILS = gql`
  query Token($chainId: Int!, $address: String!) {
    token(chainId: $chainId, address: $address) {
      ... on ERC20Token {
        address
      }
      chainId
      name
      symbol
      decimals
      logo
    }
  }
`;

export const getBasicMerkleProofQuery: DocumentNode = gql`
  query getBasicMerkleProof($merkleRoot: String!, $account: String!) {
    getBasicMerkleProof(merkleRoot: $merkleRoot, account: $account) {
      proof
    }
  }
`;
