// models/Meal.js
const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  type: { type: String, required: true }, // Veg or Non-veg
  times: { type: Number, required: true }, // Meals per day
  duration: { type: Number, required: true }, // Duration in days
  total: { type: Number, required: true },
  price: { type: Number, required: true },
  role: { type: String, required: true },
  phone: { type: Number, required: true },
  remainingMeals: { type: Number, required: true }, // Track remaining meals
  date: { type: Date, required: true },
});

module.exports = mongoose.model("Meal", mealSchema);
