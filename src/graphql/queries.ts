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
