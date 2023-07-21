const { RESTDataSource } = require("apollo-datasource-rest");

class AuthService extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://localhost:3001/auth/";
  }

  async getUsers() {
    return this.get("users");
  }

  async registerUser({ email, username, password }) {
    const response = await this.post(`register`, { email, username, password });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async loginUser({ username, password }) {
    const response = await this.post(`login`, { username, password });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async changePassword({ token, oldPassword, newPassword }) {
    const response = await this.post(`change-password`, {
      token,
      oldPassword,
      newPassword,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async logoutUser({ token }) {
    const response = await this.post(`logout`, { token });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }
}

module.exports = AuthService;
