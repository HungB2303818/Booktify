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
      reader_id: reader._id,
      book_id: book._id,
      quantity: quantity,
      borrowDate: data.borrowDate,
      returnDate: data.returnDate,
      status: data.status || "pending",
    });

    await book.save();

    //Lưu vào DB
    await record.save();

    return record;
  },

  async findAll() {
    return await BorrowRecord.find().populate("reader_id").populate("book_id");
  },

  async findById(id) {
    const record = await BorrowRecord.findById(id)
      .populate("reader_id")
      .populate("book_id");
    if (!record) throw new ApiError(404, "Không tìm thấy bản ghi mượn");
    return record;
  },
  async findByUser(reader_id) {
    return await BorrowRecord.find({ reader_id })
      .populate("reader_id")
      .populate("book_id");
  },

  async update(id, data) {
    try {
      const updated = await BorrowRecord.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      );

      return updated;
    } catch (error) {
      console.error(error);
      throw error;
    }
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
