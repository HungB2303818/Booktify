const BorrowRecord = require("../models/borrowrecord.model");
const Book = require("../models/book.model");
const ApiError = require("../api-error");
const Reader = require("../models/reader.model");

const BorrowRecordService = {
  async create(data) {
    const { reader_id, book_id, quantity } = data;

    //Kiểm tra bạn đọc theo ObjectId
    const reader = await Reader.findById(reader_id);
    if (!reader) {
      throw new ApiError(404, "Không tìm thấy bạn đọc");
    }

    //Kiểm tra sách theo ObjectId
    const book = await Book.findById(book_id);
    if (!book) {
      throw new ApiError(404, "Không tìm thấy sách");
    }

    //Kiểm tra số lượng sách còn lại
    if (book.quantity < quantity) {
      throw new ApiError(400, "Không đủ số lượng sách để mượn");
    }

    //Tạo phiếu mượn
    const record = new BorrowRecord({
      reader: reader._id,
      book: book._id,
      quantity,
      borrowDate: data.borrowDate,
      returnDate: data.returnDate,
      status: data.status || "pending",
    });

    //Trừ số lượng sách
    book.quantity -= quantity;
    await book.save();

    //Lưu vào DB
    await record.save();

    return record;
  },

  async findAll() {
    return await BorrowRecord.find()
      .populate("reader_id", "name") // đúng field trong schema
      .populate("book_id", "title author") // đúng field trong schema
  },

  async findById(id) {
    const record = await BorrowRecord.findById(id)
      .populate("reader", "name email")
      .populate("book", "title author");
    if (!record) throw new ApiError(404, "Không tìm thấy bản ghi mượn");
    return record;
  },

  async update(id, data) {
    const updated = await BorrowRecord.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updated) throw new ApiError(404, "Không tìm thấy bản ghi để cập nhật");
    return updated;
  },

  async delete(id) {
    const deleted = await BorrowRecord.findByIdAndDelete(id);
    if (!deleted) throw new ApiError(404, "Không tìm thấy bản ghi để xóa");
    return deleted;
  },

  async markAsReturned(id) {
    const record = await BorrowRecord.findById(id);
    if (!record) throw new ApiError(404, "Không tìm thấy bản ghi mượn");

    if (record.status === "Returned") {
      throw new ApiError(400, "Sách đã được trả trước đó");
    }

    record.status = "Returned";
    record.returnDate = new Date();
    await record.save();

    return record;
  },
};

module.exports = BorrowRecordService;
