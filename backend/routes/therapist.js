const express = require("express");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const {
  getApprovedTherapists,
  getPatients,
  getUserMood,
} = require("../controllers/therapistController");

const router = express.Router();

// Only authenticated users can see the approved therapists list.
// (You can allow therapists/admins too if you like.)
router.get("/", protect, restrictTo("user"), getApprovedTherapists);

router.get("/patients", protect, restrictTo("therapist"), getPatients);

router.get("/mood/:userId", protect, restrictTo("therapist"), getUserMood);

module.exports = router;
