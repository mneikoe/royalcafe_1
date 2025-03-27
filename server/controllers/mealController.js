const User = require("../models/User");

const createMeal = async (req, res) => {
  try {
    const { phone, type, times, duration, price, validity } = req.body;

    // Get user from authenticated request
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify user role
    if (user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can create meals" });
    }
    const today = new Date();
    /*const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);*/

    // Create new meal object
    const newMeal = {
      type,
      times,
      duration,
      price,
      total: times * duration,
      validity,
      remainingMeals: times * duration,
      date: today,
      expiryDate: new Date(today.getTime() + validity * 24 * 60 * 60 * 1000),
    };

    // Add meal to user's meals array
    user.meals.push(newMeal);
    await user.save();

    // Get the last added meal (Mongoose doesn't return the subdocument directly)
    const addedMeal = user.meals[user.meals.length - 1];

    res
      .status(201)
      .json({ message: "Meal created successfully", meal: addedMeal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//meal consumption
// controllers/mealController.js
/*const mealConsume = async (req, res) => {
  try {
    const { mealId } = req.params;

    // Get authenticated user
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the meal
    const meal = user.meals.id(mealId);
    if (!meal) {
      return res.status(404).json({ message: "Meal plan not found" });
    }

    // Check remaining meals
    if (meal.remainingMeals <= 0) {
      return res
        .status(400)
        .json({ message: "No meals remaining in this plan" });
    }

    // Update meal consumption
    meal.consumptions.push({ consumedAt: new Date() });
    meal.remainingMeals -= 1;

    await user.save();

    res.json({
      message: "Meal consumed successfully",
      remainingMeals: meal.remainingMeals,
      consumption: meal.consumptions[meal.consumptions.length - 1],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};*/
// controllers/mealController.js

const mealConsume = async (req, res) => {
  try {
    const { mealId, userId } = req.params;

    let user;

    if (userId) {
      // Admin is trying to consume a meal for a specific user
      user = await User.findById(userId);
    } else if (req.user && req.user.userId) {
      // Normal user consuming their own meal
      user = await User.findById(req.user.userId);
    } else {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the meal
    const meal = user.meals.id(mealId);
    if (!meal) {
      return res.status(404).json({ message: "Meal plan not found" });
    }

    // Check remaining meals
    if (meal.remainingMeals <= 0) {
      return res
        .status(400)
        .json({ message: "No meals remaining in this plan" });
    }

    // Update meal consumption
    meal.consumptions.push({ consumedAt: new Date() });
    meal.remainingMeals -= 1;

    await user.save();

    res.json({
      message: "Meal consumed successfully",
      remainingMeals: meal.remainingMeals,
      consumption: meal.consumptions[meal.consumptions.length - 1],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//delete meal
/*const deleteMeal = async (req, res) => {
  try {
    const { mealId, userId } = req.params;

    let user;

    if (userId) {
      // Admin trying to delete a meal for a specific user
      user = await User.findById(userId);
    } else if (req.user && req.user.userId) {
      // Normal user deleting their own meal
      user = await User.findById(req.user.userId);
    } else {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find and remove the meal from the user's meals array
    const meal = user.meals.id(mealId);
    if (!meal) {
      return res.status(404).json({ message: "Meal plan not found" });
    }

    meal.remove(); // Remove the meal
    await user.save();

    res.json({ message: "Meal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};*/
const deleteMeal = async (req, res) => {
  try {
    const { userId, mealId } = req.params;

    // Update the user document by pulling the meal from the array
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { meals: { _id: mealId } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Meal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createMeal, mealConsume, deleteMeal };
