const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const { authenticateToken } = require("../middleware/auth");

// Email Sending Function
async function sendEmail(userEmail, userName, userRole) {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "raj117557@gmail.com", // Your email address
        pass: "lbcf olzc rqaz ktwi", // Your app password (if you have 2FA enabled, generate an app password)
      },
    });

    const mailOptions = {
      from: "raj117557@gmail.com",
      to: userEmail,
      subject: "Welcome to JainKuti!",
      text: `Hello ${userName},\n\nYou have successfully registered as a ${userRole}.\nWe're excited to have you on board! 😊\n\nBest Regards,\nJainKuti, Bhopal`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Creating a new user
    const user = new User({ name, email, phone, password, role });
    await user.save();

    // Send a success email to the user
    await sendEmail(email, name, role);

    res
      .status(201)
      .json({ message: `${user.role} registered successfully`, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Add this endpoint to get current user data
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login Route (Unchanged)
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        meals: user.meals,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//get all users
router.get("/allusers", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//get user by phonenumber
/*router.get("/user/:phone", async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});*/
// Add phone validation and error handling
router.get("/user/:phone", async (req, res) => {
  try {
    const phone = parseInt(req.params.phone);

    // Validate phone number
    if (isNaN(phone)) {
      return res.status(400).json({ error: "Invalid phone number format" });
    }

    const user = await User.findOne({ phone }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//delete user
router.delete("/delete/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
