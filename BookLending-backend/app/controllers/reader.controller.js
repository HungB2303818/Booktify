const ReaderService = require("../services/reader.service");
const ApiError = require("../api-error");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// [POST] /api/readers
exports.create = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(400, "Tên không được để trống"));
  }

  try {
    const exist = await ReaderService.findByUsername(req.body.username);
    console.log(exist);
    if (exist) {
      return next(new ApiError(400, "Tên đăng nhập đã tồn tại"));
    }
    const reader = await ReaderService.createReader(req.body);
    return res.status(201).json(reader);
  } catch (error) {
    return next(
      new ApiError(400, error.message || "Không thể tạo bạn đọc mới")
    );
  }
};

// [GET] /api/readers
exports.findAll = async (req, res, next) => {
  try {
    const readers = await ReaderService.findAll();
    return res.json(readers);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách bạn đọc"));
  }
};

// [GET] /api/readers/:id
exports.findOne = async (req, res, next) => {
  try {
    const reader = await ReaderService.getReaderById(req.params.id);
    if (!reader) {
      return next(new ApiError(404, "Không tìm thấy bạn đọc"));
    }
    return res.json(reader);
  } catch (error) {
    console.error("GET USER ERROR:", error);
    return next(new ApiError(500, "Lỗi khi tìm bạn đọc"));
  }
};

// [PUT] /api/readers/:id
exports.update = async (req, res, next) => {
  try {
    const reader = await ReaderService.updateReader(req.params.id, req.body);
    if (!reader) {
      return next(new ApiError(404, "Không tìm thấy bạn đọc để cập nhật"));
    }
    return res.json(reader);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi cập nhật bạn đọc"));
  }
};

// [DELETE] /api/readers/:id
exports.delete = async (req, res, next) => {
  try {
    const reader = await ReaderService.deleteReader(req.params.id);
    if (!reader) {
      return next(new ApiError(404, "Không tìm thấy bạn đọc để xóa"));
    }
    return res.json({ message: "Xóa bạn đọc thành công" });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa bạn đọc"));
  }
};
exports.login = async (req, res, next) => {
  if (!req.body?.username || !req.body?.password) {
    return next(new ApiError(400, "Username or password cannot be empty"));
  }

  try {
    const user = await ReaderService.findByUsername(req.body.username);
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    const passwordIsMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordIsMatch) {
      return next(new ApiError(401, "Invalid password"));
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).send({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while login"));
  }
};
