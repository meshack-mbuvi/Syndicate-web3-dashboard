import gql from "graphql-tag";

export const MY_CLUBS_QUERY = gql`
  query getClubERC20($where: SyndicateDAO_filter) {
    syndicateDAOs(where: $where) {
      createdAt
      contractAddress
      ownerAddress
      members {
        depositAmount
      }
      totalSupply
    }
  }
`;

export const CLUBS_HAVE_INVESTED = gql`
  query getClubsHaveInvestedIn($where: Member_filter) {
    members(where: $where) {
      memberAddress
      syndicateDAOs {
        ownershipShare
        depositAmount
        syndicateDAO {
          ownerAddress
          members {
            ownershipShare
            depositAmount
          }
          totalSupply
          createdAt
          contractAddress
        }
      }
    }
  }
`;

export const CLUB_TOKEN_MEMBERS = gql`
  query getClubMembers($where: SyndicateDAO_filter) {
    syndicateDAOs(where: $where) {
      members {
        ownershipShare
        depositAmount
        member {
          memberAddress
        }
      }
      totalSupply
      contractAddress
    }
  }
`;

export const MEMBER_SIGNED_QUERY = gql`
  query memberHasSigned($clubAddress: String!, $address: String!) {
    Financial_memberSigned(clubAddress: $clubAddress, address: $address)
  }
`;
export const CLAIMED_TOKEN = gql`
  query checkTokenClaim($where: TokensClaimed_filter) {
    tokensClaimeds(where: $where) {
      id
      claimant
      club
      treeIndex
      amount
      index
    }
  }
`;

export const MERKLE_AIRDROP_CREATED = gql`
  query airdropCreated($where: MerkleAirdropCreated_filter) {
    merkleAirdropCreateds(where: $where) {
      id
      club
      treeIndex
      endTime
      startTime
      root
    }
  }
`;

export const RECENT_TRANSACTIONS = gql`
    query Query(
        $syndicateAddress: String!
        $take: Int
        $where: Financial_JSONObject
        $skip: Int
    ) {
        Financial_recentTransactions(
            syndicateAddress: $syndicateAddress
            take: $take
            where: $where
            skip: $skip
        ) {
            edges {
                blockNumber
                blockTimestamp
                contractAddress
                cumulativeGasUsed
                events {
                    eventType
                    id
                    transactionId
                }
                fromAddress
                gasLimit
                gasPrice
                gasUsed
                hash
                isError
                isOutgoingTransaction
                metadata {
                    acquisitionDate
                    annotationMetadata
                    createdAt
                    fromLabel
                    equityStake
                    memo
                    postMoneyValuation
                    preMoneyValuation
                    roundCategory
                    sharesAmount
                    toLabel
                    tokenAmount
                    transactionCategory
                    transactionId
                    updatedAt
                    companyName
                }
                syndicateAddress
                toAddress
                tokenDecimal
                tokenName
                tokenLogo
                tokenSymbol
                value
            }
            totalCount
        }
    }
`;

export const TOKEN_INTERACTIONS = gql`
    query getTokenInteractions($where: syndicateAddress_filter) {
        Financial_tokenInteractions(where: $where) {
            tokenName
            tokenSymbol
            tokenDecimal
            contractAddress
        }
    }
`;
