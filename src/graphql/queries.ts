import { gql } from "@apollo/client";

export const GET_USER_PROFILE = gql`
  query {
    Auth_getProfile {
      id
      twitterUsername
      twitterUserId
      createdAt
      profileImageURL
      updatedAt
      isApproved
    }
  }
`;
