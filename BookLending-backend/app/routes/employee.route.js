const EmployeeController = require("../controllers/employee.controller");
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");

router.post("/", EmployeeController.create);
router.get("/", EmployeeController.findAll);
router.get("/:id", EmployeeController.findOne);
router.put("/:id", EmployeeController.update);
router.delete("/:id", EmployeeController.delete);
router.post("/login", EmployeeController.login);
module.exports = router;
