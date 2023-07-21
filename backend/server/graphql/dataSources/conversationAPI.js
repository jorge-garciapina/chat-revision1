const { RESTDataSource } = require("apollo-datasource-rest");

class ConversationService extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://localhost:3003/conversation/";
  }

  async getUsersConversations() {
    return this.get("users");
  }

  async sendMessage({ sender, receiver, id, content }) {
    const response = await this.post(`sendMessage`, {
      sender,
      receiver,
      id,
      content,
    });
    if (response.error) {
      throw new Error(response.error);
    }
    return response;
  }

  async createGroupConversation({ creator, participants }) {
    const response = await this.post(`createGroupConversation`, {
      creator,
      participants,
    });
    if (response.error) {
      throw new Error(response.error);
    }
    return response;
  }
}

module.exports = ConversationService;
