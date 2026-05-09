const express = require("express");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const {
  createResource,
  getApprovedResources,
  updateResource,
  deleteResource,
  getMyResources,
} = require("../controllers/resourceController");

const router = express.Router();

// Anyone logged‐in can view approved resources
router.get("/", protect, getApprovedResources);

// Therapists can CRUD their resources
router.post("/", protect, restrictTo("therapist"), createResource);
router.get("/mine", protect, restrictTo("therapist"), getMyResources);
router.put("/:id", protect, restrictTo("therapist"), updateResource);
router.delete("/:id", protect, restrictTo("therapist"), deleteResource);

module.exports = router;
