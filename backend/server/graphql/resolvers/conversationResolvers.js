const { ApolloError } = require("apollo-server-errors");

const conversationResolvers = {
  Query: {
    usersConversations: async (_source, _args, { dataSources }) => {
      return dataSources.conversationAPI.getUsersConversations();
    },
  },
  Mutation: {
    sendMessage: async (
      _source,
      { sender, receiver, id, content },
      { dataSources }
    ) => {
      try {
        return await dataSources.conversationAPI.sendMessage({
          sender,
          receiver,
          id,
          content,
        });
      } catch (error) {
        throw new ApolloError(` ${error.message}`, "SERVER_ERROR");
      }
    },
    createGroupConversation: async (
      _source,
      { creator, participants },
      { dataSources }
    ) => {
      try {
        return await dataSources.conversationAPI.createGroupConversation({
          creator,
          participants,
        });
      } catch (error) {
        throw new ApolloError(` ${error.message}`, "SERVER_ERROR");
      }
    },
  },
};

module.exports = conversationResolvers;
