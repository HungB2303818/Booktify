const employeeService = require("../services/employee.service");
const ApiError = require("../api-error");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.create = async (req, res, next) => {
  try {
    const existing = await employeeService.getEmployeeByUsername(
      req.body.username
    );
    if (existing) {
      return next(new ApiError(400, "Tên đăng nhập này đã tồn tại"));
    }
    const employee = await employeeService.createEmployee(req.body);
    return res.status(201).json(employee);
  } catch (error) {
    return next(
      new ApiError(400, error.message || "Không thể tạo nhân viên mới")
    );
  }
};

// [GET] /api/employees
exports.findAll = async (req, res, next) => {
  try {
    const employees = await employeeService.getAllEmployees();
    return res.json(employees);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách nhân viên"));
  }
};

// [GET] /api/employees/:id
exports.findOne = async (req, res, next) => {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id);
    if (!employee) {
      return next(new ApiError(404, "Không tìm thấy nhân viên"));
    }
    return res.json(employee);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tìm nhân viên"));
  }
};

// [PUT] /api/employees/:id
exports.update = async (req, res, next) => {
  try {
    const employee = await employeeService.updateEmployee(
      req.params.id,
      req.body
    );
    if (!employee) {
      return next(new ApiError(404, "Không tìm thấy nhân viên để cập nhật"));
    }
    return res.json(employee);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi cập nhật nhân viên"));
  }
};

// [DELETE] /api/employees/:id
exports.delete = async (req, res, next) => {
  try {
    const employee = await employeeService.deleteEmployee(req.params.id);
    if (!employee) {
      return next(new ApiError(404, "Không tìm thấy nhân viên để xóa"));
    }
    return res.json({ message: "Xóa nhân viên thành công" });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa nhân viên"));
  }
};

exports.login = async (req, res, next) => {
  if (!req.body?.username || !req.body?.password) {
    return next(new ApiError(400, "Username or password cannot be empty"));
  }

  try {
    const employee = await employeeService.getEmployeeByUsername(req.body.username);
    if (!employee) {
      return next(new ApiError(404, "User not found"));
    }

    const passwordIsMatch = await bcrypt.compare(
      req.body.password,
      employee.password
    );
    if (!passwordIsMatch) {
      return next(new ApiError(401, "Invalid password"));
    }

    const token = jwt.sign(
      { id: employee._id, username: employee.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).send({
      token,
      employee: {
        id: employee._id,
        username: employee.username,
        role: employee.role,
      },
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while login"));
  }
};
