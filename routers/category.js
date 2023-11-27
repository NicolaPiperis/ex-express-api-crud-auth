const express = require ("express");
const router = express.Router();
const categoryController = require("../controllers/category");

router.get("/", categoryController.index);
router.post("/", categoryController.store);

module.exports = router