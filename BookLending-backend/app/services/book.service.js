const Book = require("../models/book.model");
const Publisher = require("../models/publisher.model");
const ApiError = require("../api-error");
class BookService {
  async create(data) {
    const publisher = await Publisher.findOne({ name: data.publisher });
    if (!publisher) throw new ApiError(404, "Không tìm thấy nhà xuất bản");
    const book = new Book(data);
    return await book.save();
  }

  async findAll() {
    return await Book.find();
  }

  async findById(id) {
    const book = await Book.findById(id);
    if (!book) throw new Error("Không tìm thấy sách");
    return book;
  }

  async update(id, data) {
    try {
      const book = await Book.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      );
      return book;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async delete(id) {
    const book = await Book.findByIdAndDelete(id);
    if (!book) throw new Error("Không tìm thấy sách để xóa");
    return book;
  }
}

module.exports = new BookService();
