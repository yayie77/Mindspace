const express = require("express");
// const auth = require("../middleware/auth");
// const { getMe, updateMe } = require("../controllers/userController");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  selectTherapist,
  getProfile,
  updateProfile,
} = require("../controllers/userController");

//get user data
router.get("/me", protect, getProfile);

router.put("/me/therapist", protect, selectTherapist);

//update
router.put("/me", protect, updateProfile);

module.exports = router;
