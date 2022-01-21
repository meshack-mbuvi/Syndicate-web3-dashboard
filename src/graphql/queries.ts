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
        tokens
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
          companyName
          createdAt
          fromLabel
          fullyDilutedOwnershipStake
          memo
          numberShares
          numberTokens
          postMoneyValuation
          preMoneyValuation
          roundCategory
          toLabel
          transactionCategory
          transactionId
          updatedAt
        }
        syndicateAddress
        toAddress
        tokenDecimal
        tokenName
        tokenLogo
        tokenSymbol
        value
        tokenDescription
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
export const CLAIMED_ERC721 = gql`
  query checkERC721Claim($where: TokensClaimed_filter) {
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

export const ERC721_MERKLE_AIRDROP_CREATED = gql`
  query airdropERC721Created($where: MerkleAirdropCreated_filter) {
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

export const CLUB_MEMBER_QUERY = gql`
  query MemberDetails(
    $where: Member_filter
    $syndicateDaOsWhere2: Membership_filter
  ) {
    members(where: $where) {
      memberAddress
      syndicateDAOs(where: $syndicateDaOsWhere2) {
        tokens
        depositAmount
        ownershipShare
      }
    }
  }
`;

export const SINGLE_CLUB_DETAILS = gql`
  query SyndicateDAOs($where: SyndicateDAO_filter) {
    syndicateDAOs(where: $where) {
      contractAddress
      ownerAddress
      totalSupply
      createdAt
      totalDeposits
    }
  }
`;
