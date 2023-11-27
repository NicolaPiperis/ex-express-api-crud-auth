const express = require ("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { checkSchema } = require("express-validator");
const {checkValidity} = require("../middleware/schemaValidator");
const userRegister = require("../validations/userRegister");
const userLogin = require("../validations/userLogin");

router.post("/login", checkSchema(userLogin), checkValidity, authController.login);
router.post("/register", checkSchema(userRegister), checkValidity, authController.register);

module.exports = router;