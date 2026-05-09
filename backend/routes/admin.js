const express = require("express");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const {
  approveTherapist,
  getTherapists,
  deleteTherapist,
  deleteUser,
  getUsers,
  getStats,
} = require("../controllers/adminController");
const {
  getPendingResources,
  updateResourceStatus,
} = require("../controllers/adminResourceController");
const router = express.Router();

// Approve therapist (admin only)
router.put(
  "/therapists/:id/approve",
  protect,
  restrictTo("admin"),
  approveTherapist
);

// get all therapists data
router.get("/therapists", protect, restrictTo("admin"), getTherapists);
//delete therapists data
router.delete("/therapists/:id", protect, restrictTo("admin"), deleteTherapist);
//get stats of all users, chats and other features
router.get("/stats", protect, restrictTo("admin"), getStats);

// Users
router.get("/users", protect, restrictTo("admin"), getUsers);
router.delete("/users/:id", protect, restrictTo("admin"), deleteUser);

// Admin routes for moderation:
router.get("/resources", protect, restrictTo("admin"), getPendingResources);
router.put(
  "/resources/:id",
  protect,
  restrictTo("admin"),
  updateResourceStatus
);

module.exports = router;
