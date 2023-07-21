const { ApolloError } = require("apollo-server-errors");

const authResolvers = {
  Query: {
    users: async (_source, _args, { dataSources }) => {
      return dataSources.authAPI.getUsers();
    },
  },

  Mutation: {
    registerUser: async (
      _source,
      { email, username, password, avatar },
      { dataSources }
    ) => {
      try {
        // Register the user with the auth service
        const registerResponse = await dataSources.authAPI.registerUser({
          email,
          username,
          password,
        });

        // Create the same user in the user service
        await dataSources.userAPI.createUser({
          email,
          username,
          avatar,
        });

        // Combine the responses, or handle them as you wish
        return registerResponse;
      } catch (error) {
        // Throw an ApolloError with a custom message and code
        throw new ApolloError(` ${error.message}`, "SERVER_ERROR");
      }
    },

    loginUser: async (_source, { username, password }, { dataSources }) => {
      try {
        return await dataSources.authAPI.loginUser({
          username,
          password,
        });
      } catch (error) {
        // Throw an ApolloError with a custom message and code
        throw new ApolloError(` ${error.message}`, "SERVER_ERROR");
      }
    },

    changePassword: async (
      _source,
      { token, oldPassword, newPassword },
      { dataSources }
    ) => {
      try {
        return await dataSources.authAPI.changePassword({
          token,
          oldPassword,
          newPassword,
        });
      } catch (error) {
        // Throw an ApolloError with a custom message and code
        throw new ApolloError(` ${error.message}`, "SERVER_ERROR");
      }
    },

    logoutUser: async (_source, { token }, { dataSources }) => {
      try {
        return await dataSources.authAPI.logoutUser({
          token,
        });
      } catch (error) {
        // Throw an ApolloError with a custom message and code
        throw new ApolloError(`Server Error: ${error.message}`, "SERVER_ERROR");
      }
    },
  },
};

module.exports = authResolvers;
