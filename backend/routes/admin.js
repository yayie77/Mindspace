const express = require("express");
const router = express.Router();

// Admin disabled safely
router.all("*", (req, res) => {
  res.status(403).json({ message: "Admin routes disabled" });
});

module.exports = router;