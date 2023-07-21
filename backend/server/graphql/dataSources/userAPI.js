const { RESTDataSource } = require("apollo-datasource-rest");

class UserService extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://localhost:3002/user/";
  }

  willSendRequest(request) {
    request.headers.set("Authorization", this.context.token);
    // request.headers.set("Content-Type", "application/json");
  }

  async getUsersUser() {
    return this.get("usersUser");
  }

  async createUser({ email, username, avatar, contactList }) {
    const response = await this.post(`create`, {
      email,
      username,
      avatar,
      contactList,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async getUserInfo() {
    const response = await this.get(`info`);

    if (response.error) {
      throw new Error(response.error);
    }

    return {
      email: response.email,
      username: response.username,
      contactList: response.contactList,
      avatar: response.avatar,
      receivedContactRequests: response.receivedContactRequests,
      rejectedContactRequests: response.rejectedContactRequests,
      pendingContactRequests: response.pendingContactRequests,
    };
  }

  async searchUser(searchTerm) {
    const response = await this.post(`searchUser`, { searchTerm });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async sendContactRequest({ receiverUsername }) {
    const response = await this.post(`sendContactRequest`, {
      receiverUsername,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async acceptContactRequest({ senderUsername }) {
    const response = await this.post(`acceptContactRequest`, {
      senderUsername,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async rejectContactRequest(senderUsername) {
    const response = await this.post(`rejectContactRequest`, {
      senderUsername,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async retrieveContactRequests() {
    const response = await this.get(`retrieveContactRequests`);

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async retrievePendingContactRequests() {
    const response = await this.get(`retrievePendingContactRequests`);

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async deleteContact(receiverUsername) {
    const response = await this.post("deleteContact", { receiverUsername });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async cancelRequest(receiverUsername) {
    const response = await this.post(`cancelRequest`, { receiverUsername });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }
}

module.exports = UserService;
