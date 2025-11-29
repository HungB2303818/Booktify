const Reader = require("../models/reader.model");
const ApiError = require("../api-error");
const bcrypt = require("bcrypt");

class ReaderService {
  async createReader(payload) {
    const reader = new Reader({
      username: payload.username,
      name: payload.name || undefined,
      password: payload.password,
      role: payload.role || "user",
      birthdate: payload.birthdate || undefined,
      sex: payload.sex,
      address: payload.address || undefined,
      phone: payload.phone || undefined,
    });

    reader.password = await bcrypt.hash(reader.password, 12);
    return await reader.save();
  }

  async findAll() {
    return await Reader.find();
  }
  async findByUsername(username) {
    return await Reader.findOne({ username });
  }
  async getReaderById(id) {
    const reader = await Reader.findById(id);
    if (!reader) throw new Error("Không tìm thấy độc giả");
    return reader;
  }
  async updateReader(id, data) {
    const reader = await Reader.findById(id);
    if (!reader) throw new Error("Không tìm thấy độc giả để cập nhật");

    // Nếu có password mới → hash lại
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    }

    Object.assign(reader, data);
    return await reader.save();
  }
  async deleteReader(id) {
    const reader = await Reader.findByIdAndDelete(id);
    if (!reader) throw new Error("Không tìm thấy độc giả để xóa");
    return reader;
  }
}

module.exports = new ReaderService();
