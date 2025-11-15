const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const borrowRecordSchema = new mongoose.Schema({
  book_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Book",
  },
  reader_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Reader",
  },
  employee_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Employee",
  },
  borrowDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  returnDate: {
    type: Date,
    required: false,
  },
  status: {
    type: String,
    enum: ["waiting", "borrowing", "returned", "overdue", "rejected"],
    required: true,
    default: "borrowing",
  },
});
const BorrowRecord = mongoose.model("BorrowRecord", borrowRecordSchema);
module.exports = BorrowRecord;
