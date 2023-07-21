const conversationSchemas = `#graphql
  type UserConversation{
    email: String
    username: String
    password: String
  }
  type Query {
    usersConversations: [UserConversation]
  }
  type Message {
    chatID: String
    receivers: [String]
  }
  type Group {
    chatID: String
    participants: [String]
  }
  type Mutation {
    sendMessage(sender: String, receiver: String, id: String, content: String): Message
    createGroupConversation(creator: String, participants: [String]): Group
  }
`;

module.exports = conversationSchemas;
