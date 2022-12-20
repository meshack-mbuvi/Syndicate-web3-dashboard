import { DocumentNode } from '@apollo/client';
import gql from 'graphql-tag';

export const MY_CLUBS_QUERY = gql`
  query getClubERC20($where: SyndicateDAO_filter) {
    syndicateDAOs(where: $where) {
      id
      createdAt
      contractAddress
      ownerAddress
      members {
        id
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
      id
      contractAddress
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

export const TOKEN_HOLDINGS_AND_DETAILS = gql`
  query Query(
    $chainId: Int!
    $walletAddress: String!
    $filter: TokenHoldingsFilter
  ) {
    tokenHoldings(
      chainId: $chainId
      walletAddress: $walletAddress
      filter: $filter
    ) {
      balance
      token {
        address
        name
        symbol
        decimals
        logo
      }
    }
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
  query Query(
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
      precommits {
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
