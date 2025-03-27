const express = require("express");
const router = express.Router();
const {
  authenticateToken,
  authorizeAdmin,
  authorizeStudent,
} = require("../middleware/auth");
const User = require("../models/User");

// Admin Dashboard - Get all users
router.get(
  "/admin/dashboard",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Student Dashboard - Get student's own data
router.get(
  "/student/dashboard",
  authenticateToken,
  authorizeStudent,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select("-password");
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Common protected route example
router.get("/dashboard", authenticateToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.role}` });
});

module.exports = router;
