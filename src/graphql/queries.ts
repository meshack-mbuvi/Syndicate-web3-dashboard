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
