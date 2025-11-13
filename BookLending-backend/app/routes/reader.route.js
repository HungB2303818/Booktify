const ReaderController = require("../controllers/reader.controller");
const express = require("express");
const auth = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/login", ReaderController.login);

router.post("/", ReaderController.create);
router.get("/", ReaderController.findAll);

router.get("/:id", ReaderController.findOne);
router.put("/:id", ReaderController.update);
router.delete("/:id", ReaderController.delete);

module.exports = router;