import gql from 'graphql-tag';

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
      totalDeposits
      maxTotalSupply
      endTime
      startTime
      maxMemberCount
      requiredToken
      requiredTokenMinBalance
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
            tokens
            member {
              memberAddress
            }
          }
          totalSupply
          totalDeposits
          startTime
          endTime
          createdAt
          contractAddress
          maxTotalSupply
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
      totalDeposits
      contractAddress
      startTime
      endTime
    }
  }
`;

export const MEMBER_SIGNED_QUERY = gql`
  query memberHasSigned($clubAddress: String!, $address: String!) {
    Financial_memberSigned(clubAddress: $clubAddress, address: $address)
  }
`;
export const CLAIMED_TOKEN = gql`
  query checkTokenClaim($where: TokensClaimedERC20_filter) {
    tokensClaimedERC20S(where: $where) {
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
  query airdropCreated($where: MerkleAirdropCreatedERC20_filter) {
    merkleAirdropCreatedERC20S(where: $where) {
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
    $input: String!
    $take: Int
    $where: Financial_JSONObject
    $skip: Int
    $chainId: Int!
  ) {
    Financial_recentTransactions(
      input: $input
      take: $take
      where: $where
      skip: $skip
      chainId: $chainId
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
      startTime
      endTime
    }
  }
`;

export const CLUB_TOKEN_QUERY = gql`
  query Query($syndicateDaoId: ID!) {
    syndicateDAO(id: $syndicateDaoId) {
      id
      depositToken
    }
  }
`;

export const GetSynToken = gql`
  query GetSynToken($chainId: Int, $where: SyndicateDAO_filter) {
    syndicateDAOs(chainId: $chainId, where: $where) {
      contractAddress
    }
  }
`;

export const GetAdminCollectives = gql`
  query SyndicateCollectives($where: SyndicateCollective_filter) {
    syndicateCollectives(where: $where) {
      contractAddress
      ownerAddress
      createdAt
      name
      symbol
      maxTotalSupply
      mintPrice
      numMinted
      totalSupply
      maxPerMember
      numOwners
      owners {
        id
      }
      nftMetadata {
        description
        metadataCid
        mediaCid
      }
      areNftsTransferable
      modules {
        activeRequirements {
          requirement {
            endTime
            requirementType
          }
        }
      }
    }
  }
`;

export const GetMemberCollectives = gql`
  query Nfts($where: Nft_filter) {
    nfts(where: $where) {
      collective {
        contractAddress
        ownerAddress
        name
        symbol
        maxTotalSupply
        mintPrice
        totalSupply
        numMinted
        nftMetadata {
          metadataCid
        }
      }
    }
  }
`;
