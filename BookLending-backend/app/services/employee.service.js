const Employee = require("../models/employee.model");
const ApiError = require("../api-error");
const bcrypt = require("bcrypt");
class EmployeeService {
  async createEmployee(payload) {
    const employee = new Employee({
      username: payload.username,
      name: payload.name || undefined,
      password: payload.password,
      role: payload.role || "staff",
      address: payload.address || undefined,
      phone: payload.phone || undefined,
    });
    employee.password = await bcrypt.hash(employee.password, 12);
    return await employee.save();
  }
  async getAllEmployees() {
    return await Employee.find();
  }
  async getEmployeeById(id) {
    const employee = await Employee.findById(id);
    if (!employee) throw new Error("Không tìm thấy nhân viên");
    return employee;
  }
  async getEmployeeByUsername( username) {
    return await Employee.findOne({ username });
  }
  async updateEmployee(id, data) {
    const employee = await Employee.findByIdAndUpdate(id, data, { new: true });
    if (!employee) throw new Error("Không tìm thấy nhân viên để cập nhật");
    return employee;
  }
  async deleteEmployee(id) {
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) throw new Error("Không tìm thấy nhân viên để xóa");
    return employee;
  }
}

module.exports = new EmployeeService();
