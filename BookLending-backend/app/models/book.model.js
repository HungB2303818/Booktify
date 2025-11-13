const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookschema = new Schema({
  title: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
});

const Book = mongoose.model("Book", bookschema);
module.exports = Book;
