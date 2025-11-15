const borrowrecordService = require("../services/borrowrecord.service");
const ApiError = require("../api-error");

// [POST] /api/borrowrecords
exports.create = async (req, res, next) => {
  try {
    const { reader_id, book_id } = req.body;

    // Validate
    if (!reader_id || !book_id) {
      return next(new ApiError(400, "Thiếu readerId hoặc bookId"));
    }

    // Tạo record
    const record = await borrowrecordService.create({
      reader_id,
      book_id,
      ...req.body, // các field khác như borrowDate, returnDate...
    });

    return res.status(201).json(record);
  } catch (error) {
    return next(error);
  }
};

// [GET] /api/borrowrecords
exports.findAll = async (req, res, next) => {
  try {
    const records = await borrowrecordService.findAll();
    return res.json(records);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách bản ghi mượn sách"));
  }
};

// [GET] /api/borrowrecords/:id
exports.findOne = async (req, res, next) => {
  try {
    const record = await borrowrecordService.findById(req.params.id);
    if (!record) {
      return next(new ApiError(404, "Không tìm thấy bản ghi mượn sách"));
    }
    return res.json(record);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tìm bản ghi mượn sách"));
  }
};

// [PUT] /api/borrowrecords/:id
exports.update = async (req, res, next) => {
  try {
    const record = await borrowrecordService.update(
      req.params.id,
      req.body
    );
    if (!record) {
      return next(
        new ApiError(404, "Không tìm thấy bản ghi mượn sách để cập nhật")
      );
    }
    return res.json(record);
  } catch (error) {
     return next(error);
  }
};

// [DELETE] /api/borrowrecords/:id
exports.delete = async (req, res, next) => {
  try {
    const record = await borrowrecordService.deleteBorrowRecord(req.params.id);
    if (!record) {
      return next(new ApiError(404, "Không tìm thấy bản ghi mượn sách để xóa"));
    }
    return res.json({ message: "Xóa bản ghi mượn sách thành công" });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa bản ghi mượn sách"));
  }
};

// [POST] /api/borrowrecords/:id/return
exports.markAsReturned = async (req, res, next) => {
  try {
    const record = await borrowrecordService.markAsReturned(req.params.id);
    if (!record) {
      return next(
        new ApiError(404, "Không tìm thấy bản ghi mượn sách để đánh dấu trả")
      );
    }
    return res.json(record);
  } catch (error) {
    return next(error);
  }
};
