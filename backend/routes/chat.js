// routes/chat.js
const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getOrCreateSession,
  getSessions,
  getMessages,
} = require("../controllers/chatController");
const router = express.Router();

// create or fetch a 1:1 session
router.post("/", protect, getOrCreateSession);

// list all sessions for this user
router.get("/sessions", protect, getSessions);

// get message history
router.get("/:sessionId", protect, getMessages);

module.exports = router;
