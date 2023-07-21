// chat-app/frontend/src/graphqlQueries/authQueries.js
import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers {
    users {
      email
      username
      password
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser(
    $email: String!
    $username: String!
    $password: String!
    $avatar: String
  ) {
    registerUser(
      email: $email
      username: $username
      password: $password
      avatar: $avatar
    ) {
      token
      message
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      token
      message
    }
  }
`;
