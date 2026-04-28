const express = require("express");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const {
  getMyEntries,
  getEntryById,
  createEntry,
  updateEntry,
  deleteEntry,
} = require("../controllers/moodController");

const router = express.Router();

// All routes below require a logged-in user with role “user”
router.use(protect, restrictTo("user"));

router.get("/", getMyEntries);
router.get("/:id", getEntryById);
router.post("/", createEntry);
router.put("/:id", updateEntry);
router.delete("/:id", deleteEntry);

module.exports = router;
