const userResolvers = {
  Query: {
    usersUser: async (_source, _args, { dataSources }) => {
      return dataSources.userAPI.getUsersUser();
    },
    userInfo: async (_source, _args, { dataSources }) => {
      return dataSources.userAPI.getUserInfo();
    },

    searchUser: async (_source, { searchTerm }, { dataSources }) => {
      return dataSources.userAPI.searchUser(searchTerm);
    },

    retrieveContactRequests: async (_source, _args, { dataSources }) => {
      return dataSources.userAPI.retrieveContactRequests();
    },

    retrievePendingContactRequests: async (_source, _args, { dataSources }) => {
      return dataSources.userAPI.retrievePendingContactRequests();
    },
  },

  Mutation: {
    createUser: async (
      _source,
      { email, username, avatar, contactList },
      { dataSources }
    ) => {
      return dataSources.userAPI.createUser({
        email,
        username,
        avatar,
        contactList,
      });
    },

    //TODO: first with auth, then with users
    sendContactRequest: async (
      _source,
      { receiverUsername },
      { dataSources }
    ) => {
      return dataSources.userAPI.sendContactRequest({ receiverUsername });
    },

    acceptContactRequest: async (
      _source,
      { senderUsername },
      { dataSources }
    ) => {
      return dataSources.userAPI.acceptContactRequest({ senderUsername });
    },

    rejectContactRequest: async (
      _source,
      { senderUsername },
      { dataSources }
    ) => {
      return dataSources.userAPI.rejectContactRequest(senderUsername);
    },

    deleteContact: async (_source, { receiverUsername }, { dataSources }) => {
      return dataSources.userAPI.deleteContact(receiverUsername);
    },

    cancelRequest: async (_source, { receiverUsername }, { dataSources }) => {
      return dataSources.userAPI.cancelRequest(receiverUsername);
    },
  },
};

module.exports = userResolvers;
