import { gql } from '@apollo/client';

export const GetAdminDeals = gql`
  query AdminDeals($where: Deal_filter) {
    deals(where: $where) {
      id
      closed
      numCommits
      goal
      totalCommitted
      depositToken
      dealToken {
        id
        name
        symbol
      }
      mixins {
        id
        requirementType
        minPerMember
        startTime
        endTime
      }
    }
  }
`;

export const GetDealDetails = gql`
  query DealDetails($dealId: ID!) {
    deal(id: $dealId) {
      id
      ownerAddress
      destinationAddress
      closed
      numCommits
      goal
      totalCommitted
      depositToken
      dealToken {
        id
        contractAddress
        createdAt
        name
        symbol
      }
      mixins {
        id
        requirementType
        minPerMember
        startTime
        endTime
      }
    }
  }
`;

export const GetDealPrecommits = gql`
  query Precommits($dealId: ID!) {
    deal(id: $dealId) {
      id
      precommits(
        where: { status_not: CANCELED }
        orderBy: createdAt
        orderDirection: asc
      ) {
        id
        userAddress
        amount
        status
        createdAt
      }
    }
  }
`;

export const GetMemberPrecommit = gql`
  query Precommit($where: Precommit_filter) {
    precommits(where: $where) {
      id
      deal {
        id
      }
      userAddress
      amount
      createdAt
      status
    }
  }
`;

export const GetMemberDeals = gql`
  query MemberPrecommits($where: Precommit_filter) {
    precommits(where: $where) {
      id
      status
      deal {
        id
        closed
        numCommits
        goal
        totalCommitted
        depositToken
        dealToken {
          id
          name
          symbol
        }
        mixins {
          id
          requirementType
          minPerMember
          startTime
          endTime
        }
      }
    }
  }
`;

export const MY_CLUBS_QUERY = gql`
  query getCubsIAdmin($where: SyndicateDAO_filter) {
    syndicateDAOs(where: $where) {
      id
      createdAt
      contractAddress
      ownerAddress
      members {
        id
        depositAmount
        tokens
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
      createdAt
      id
      memberAddress
      syndicateDAOs {
        depositAmount
        syndicateDAO {
          id
          ownerAddress
          members {
            id
            depositAmount
            tokens
            member {
              createdAt
              id
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
  query getClubMembers(
    $where: SyndicateDAO_filter
    $where2: SyndicateEvent_filter
  ) {
    syndicateDAOs(where: $where) {
      id
      members {
        id
        depositAmount
        tokens
        createdAt
        member {
          id
          memberAddress
        }
      }
      totalSupply
      totalDeposits
      contractAddress
      startTime
      endTime
    }

    syndicateEvents(where: $where2) {
      ... on MemberMinted {
        memberAddress
        createdAt
      }
      ... on MemberMintedEth {
        memberAddress
        createdAt
      }
      ... on OwnerMinted {
        createdAt
        memberAddress
      }
    }
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

export const CLUB_MEMBER_QUERY = gql`
  query MemberDetails(
    $where: Member_filter
    $syndicateDaOsWhere2: Membership_filter
  ) {
    members(where: $where) {
      id
      memberAddress
      syndicateDAOs(where: $syndicateDaOsWhere2) {
        id
        tokens
        depositAmount
        syndicateDAO {
          totalSupply
        }
      }
    }
  }
`;

export const SINGLE_CLUB_DETAILS = gql`
  query SyndicateDAOs($where: SyndicateDAO_filter) {
    syndicateDAOs(where: $where) {
      id
      contractAddress
      ownerAddress
      totalSupply
      createdAt
      totalDeposits
      maxTotalSupply
      endTime
      startTime
      maxMemberCount
      activeModules {
        id
        contractAddress
        activeRequirements {
          id
          requirement {
            id
            contractAddress
            eventType
            requirementType
            maxMemberCount
            maxTotalSupply
            startTime
            endTime
            requiredTokensLogicalOperator
            requiredTokens
            requiredTokenBalances
          }
        }
      }
    }
  }
`;

export const CLUB_TOKEN_QUERY = gql`
  query SyndicateDAOById($syndicateDaoId: ID!) {
    syndicateDAO(id: $syndicateDaoId) {
      id
      depositToken
    }
  }
`;

export const GetAdminCollectives = gql`
  query SyndicateCollectives($where: SyndicateCollective_filter) {
    syndicateCollectives(where: $where) {
      id
      contractAddress
      ownerAddress
      createdAt
      name
      symbol
      maxTotalSupply
      mintPrice
      totalSupply
      maxPerMember
      numOwners
      owners {
        id
        owner {
          id
          walletAddress
        }
      }
      nftMetadata {
        id
        description
        metadataCid
        mediaCid
      }
      transferGuardAddress
      activeModules {
        id
        activeRequirements {
          id
          requirement {
            id
            endTime
            startTime
            requirementType
            maxTotalSupply
          }
        }
        contractAddress
      }
    }
  }
`;

export const GetMemberCollectives = gql`
  query Nfts($where: Nft_filter) {
    nfts(where: $where) {
      collective {
        id
        contractAddress
        ownerAddress
        name
        symbol
        maxTotalSupply
        mintPrice
        totalSupply
        nftMetadata {
          metadataCid
        }
      }
    }
  }
`;

export const GetERC721MemberEvents = gql`
  query GetEvents($where: MintERC721_filter) {
    mintERC721S(where: $where) {
      to
      createdAt
    }
  }
`;

export const graphCurrentBlock = gql`
  query graphCurrentBlock {
    _meta {
      block {
        hash
        number
      }
      deployment
    }
  }
`;
