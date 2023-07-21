const authSchemas = `#graphql
  type Example{
    email: String
    username: String
    password: String
  }

  type Query {
    users: [Example]
  }

  type User {
    token: String
    message: String
  }

  type Mutation {
    registerUser(email: String, username: String, password: String, avatar: String): User
    loginUser(username: String, password: String): User
    changePassword(token: String!, oldPassword: String!, newPassword: String!): User
    logoutUser(token: String!): User

  }
`;

module.exports = authSchemas;
