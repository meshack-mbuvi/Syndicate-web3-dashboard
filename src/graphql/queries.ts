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
  query LegacyTransactionEventQuery(
    $chainId: Int!
    $input: String!
    $limit: Int
    $order: Order = desc
  ) {
    legacyTransactionEvents(
      chainId: $chainId
      input: $input
      order: $order
      limit: $limit
    ) {
      cursor
      events {
        chainId
        ownerAddress
        hash
        blockNumber
        timestamp
        transactionIndex
        contractAddress
        transfers {
          chainId
          blockNumber
          timestamp
          hash
          from
          to
          contractAddress
          gas
          ... on NativeTransfer {
            value
          }
          ... on Erc20Transfer {
            tokenName
            tokenSymbol
            tokenDecimal
            tokenLogo
            value
          }
          ... on Erc721Transfer {
            tokenId
            tokenName
            tokenSymbol
            tokenDecimal
          }
          ... on Erc1155Transfer {
            tokenId
            tokenName
            tokenSymbol
            tokenValue
          }
        }
        annotation {
          chainId
          acquisitionDate
          createdAt
          updatedAt
          equityStake
          fromLabel
          transactionId
          syndicateAddress
          preMoneyValuation
          postMoneyValuation
          roundCategory
          sharesAmount
          toLabel
          tokenAmount
          transactionCategory
          memo
          companyName
          annotationMetadata
        }
        syndicateEvents {
          eventType
          id
          transactionId
          distributionBatch
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
