import { gql } from "@apollo/client";

export const GET_USER_INFO = gql`
  query {
    userInfo {
      email
      username
      contactList
      avatar
    }
  }
`;

export const SEARCH_USER = gql`
  query SearchUser($searchTerm: String!) {
    searchUser(searchTerm: $searchTerm) {
      username
      avatar
    }
  }
`;
