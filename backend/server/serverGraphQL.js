// Importing necessary modules
const { ApolloServer } = require("apollo-server");
const { merge } = require("lodash");
const { mergeTypeDefs } = require("@graphql-tools/merge");
// Importing schema and resolvers
const authSchemas = require("./graphql/schemas/authSchemas.js");
const authResolvers = require("./graphql/resolvers/authResolvers.js");

const userSchemas = require("./graphql/schemas/userSchemas.js");
const userResolvers = require("./graphql/resolvers/userResolvers.js");

const conversationSchemas = require("./graphql/schemas/conversationSchemas.js");
const conversationResolvers = require("./graphql/resolvers/conversationResolvers.js");

const AuthService = require("./graphql/dataSources/authAPI.js");
const UserService = require("./graphql/dataSources/userAPI.js");
const ConversationService = require("./graphql/dataSources/conversationAPI.js");

// Apollo Server Setup
const server = new ApolloServer({
  typeDefs: mergeTypeDefs([authSchemas, userSchemas, conversationSchemas]),
  resolvers: merge(authResolvers, userResolvers, conversationResolvers),
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    return { token };
  },
  dataSources: () => {
    return {
      authAPI: new AuthService(),
      userAPI: new UserService(),
      conversationAPI: new ConversationService(),
    };
  },
  formatError: (err) => {
    // Only return the essential error message
    return { message: err.message };
  },
});
// Starting the server
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
