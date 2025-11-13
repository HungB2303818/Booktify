import ApiClient from "./api.service";

class UserService {
  constructor(baseUrl = "/api/readers") {
    this.api = ApiClient(baseUrl);
  }
  async getAllUsers() {
    return (await this.api.get("/")).data;
  }
  async register(data) {
    try {
      const response = await this.api.post("/", data);
      return response.data;
    } catch (error) {
      console.error("Register failed:", {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });
      throw error;
    }
  }
  async getUser(id) {
    return (await this.api.get(`/${id}`)).data;
  }
  async updateUser(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }
  async deleteUser(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
  async deleteAllUsers() {
    return (await this.api.delete("/")).data;
  }
  async login(username, password) {
    try {
      const response = await this.api.post("/login", { username, password });
      return response;
    } catch (error) {
      throw error;
    }
  }
}
export default UserService;
