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
