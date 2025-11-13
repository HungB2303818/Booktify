import ApiClient from "./api.service";

class BookService {
  constructor(baseUrl = "/api/books") {
    this.api = ApiClient(baseUrl);
  }

  async getAllBooks() {
    return (await this.api.get("/")).data;
  }

  async getBookById(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async createBook(data) {
    return (await this.api.post("/", data)).data;
  }

  async updateBook(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  async deleteBook(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  async deleteAllBook() {
    return (await this.api.delete("/")).data;
  }
}

export default BookService;
