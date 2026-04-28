const express = require("express");
const { register, login } = require("../controllers/authController");
const router = express.Router();

// POST request to register new user
router.post("/register", register);

// POST request to authenticate user in and receive a JWT
router.post("/login", login);

module.exports = router;
