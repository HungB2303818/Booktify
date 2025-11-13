const jwt = require("jsonwebtoken");
const ApiError = require("../api-error");

const auth = (req, res, next) => {
  //Lấy token từ header Authorization
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; //Bearer <token>

  if (!token) {
    return next(new ApiError(401, "Không có token, vui lòng đăng nhập"));
  }

  try {
    //decode token
    const secretKey = process.env.JWT_SECRET || "secret_key";
    const decoded = jwt.verify(token, secretKey);

    //Lưu thông tin người dùng đã xác thực vào request
    req.user = decoded;

    //Cho phép đi tiếp
    next();
  } catch (err) {
    return next(new ApiError(403, "Token không hợp lệ hoặc đã hết hạn"));
  }
};

module.exports = auth;
