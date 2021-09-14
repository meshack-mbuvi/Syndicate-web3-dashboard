import gql from "graphql-tag";

export const TEST_USER = gql`
  query Query {
    testUsers {
      entityName
    }
  }
`;
