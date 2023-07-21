// File: chat-app/backend/server/graphql/schemas/userSchemas.js

const userSchemas = `#graphql
  type ExampleUser {
    email: String
    username: String
    password: String
  }

  type ContactRequest {
    sender: String
    date: String
    status: String
  }

  type UserInfo {
    email: String
    username: String
    contactList: [String]
    avatar: String
    receivedContactRequests: [ContactRequest]
    rejectedContactRequests: [ContactRequest]
    pendingContactRequests: [ContactRequest]
  }

  type UserCreationResponse {
    message: String
  }

  type UserSearchResult {
    username: String
    avatar: String
  }

  type Query {
    usersUser: [ExampleUser]
    userInfo: UserInfo
    searchUser(searchTerm: String): UserSearchResult
    retrieveContactRequests: [String]
    retrievePendingContactRequests: [String]
  }

  type Mutation {
    createUser(email: String, username: String, avatar: String, contactList: [String]): UserCreationResponse
    sendContactRequest(receiverUsername: String!): MessageResponse
    acceptContactRequest(senderUsername: String!): UserCreationResponse
    rejectContactRequest(senderUsername: String): RejectionResponse
    deleteContact(receiverUsername: String!): DeletionResponse
    cancelRequest(receiverUsername: String): UserCreationResponse
  }

  type DeletionResponse {
    message: String
  }
  type RejectionResponse {
  message: String
}

  type MessageResponse {
  message: String
}
`;

module.exports = userSchemas;
