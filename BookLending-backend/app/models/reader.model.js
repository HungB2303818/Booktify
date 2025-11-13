const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const readerschema = new Schema({
  // readerCode: {
  //   type: String,
  // },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  sex: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
});
const Reader = mongoose.model("Reader", readerschema);
module.exports = Reader;
