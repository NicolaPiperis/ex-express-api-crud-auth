const express = require ("express");
const router = express.Router();

const tagsController = require("../controllers/tag");

router.get("/", tagsController.index);
router.post("/", tagsController.store);

module.exports = router