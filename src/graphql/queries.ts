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
  query getClubsHaveInvestedIn($where: Membership_filter) {
    members {
      syndicateDAOs(where: $where) {
        depositAmount
        syndicateDAO {
          contractAddress
          ownerAddress
          totalSupply
          createdAt
          members {
            depositAmount
          }
        }
        member {
          memberAddress
        }
      }
    }
  }
`;
