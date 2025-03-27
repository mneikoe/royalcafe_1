// routes/mealRoutes.js
const express = require("express");
const router = express.Router();
const {
  createMeal,
  mealConsume,
  deleteMeal,
} = require("../controllers/mealController");
const { authenticateToken } = require("../middleware/auth");
// Create a new meal and assign it to a student
router.post("/create", createMeal);
router.post("/consume/:mealId", authenticateToken, mealConsume);
router.post("/consume/:mealId/:userId", authenticateToken, mealConsume);
router.delete("/delete/:mealId/:userId", authenticateToken, deleteMeal);
module.exports = router;
