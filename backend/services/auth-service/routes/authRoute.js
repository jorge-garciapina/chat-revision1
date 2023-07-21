// Importing the necessary modules and environmental variables
const express = require("express");
const User = require("../models/authModel");
const jwt = require("jsonwebtoken");

const validateInput = require("../validation/backendValidation");

require("dotenv").config({ path: "./privateValues.env" });

// Creating a new Express Router instance
const router = express.Router();

///////////////////////////////
// Example to test connection:
// Pre-defined users
const users = [
  {
    email: "john@example.com",
    username: "john",
    password: "password123",
  },
  {
    email: "jane@example.com",
    username: "jane",
    password: "password123",
  },
];

// Endpoint to fetch users
router.get("/users", (req, res) => {
  res.json(users);
});

///////////////////////////////

router.post("/register", async (req, res) => {
  // Extract email, username, password, and avatar from the request body
  const { email, username, password } = req.body;
  try {
    // Check if a user with the same email already exists
    const existingUser_email = await User.findOne({ email });

    if (existingUser_email) {
      return res.status(201).json({ error: "Email already exists" });
    }

    // Check if a user with the same username already exists
    const existingUser_username = await User.findOne({ username });
    if (existingUser_username) {
      return res.status(201).json({ error: "Username already exists" });
    }
    // Create a new user instance
    const user = new User({ email, username, password });

    // Generate token for the user
    await user.generateToken();

    // Save the user with the generated token
    await user.save();

    res.status(201).json({
      message: "Registration successful",
      token: user.token,
    });
  } catch (error) {
    console.error(error); // Log the full error
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

//////////////////////////////////////
router.post("/login", validateInput, async (req, res) => {
  try {
    const { username, password } = req.body;

    let user = await User.findOne({ username });
    if (!user) {
      return res.status(200).json({ error: "Invalid username or password" });
    }
    user.verifyPassword(password, async (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(200).json({ error: "Invalid username or password" });
      }
      const token = await user.generateToken();

      res.status(200).json({ token: token });
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});
////////////////////////////////////////////
// Route to change a user's password
router.post("/change-password", async (req, res) => {
  try {
    // Extract the token, old password, and new password from the request body
    const { token, oldPassword, newPassword } = req.body;

    let decoded;
    try {
      // Decode the token to get the user id
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(200).json({ error: "Invalid or expired token" });
    }

    if (!decoded) {
      return res.status(200).json({ error: "Invalid or expired token" });
    }

    const username = decoded["username"];

    // Find the user with the ID extracted from the token
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(200).json({ error: "User not found" });
    }

    // Verify the old password
    user.verifyPassword(oldPassword, async (err, isMatch) => {
      if (err || !isMatch) {
        return res
          .status(200)
          .json({ error: "Current password does not match" });
      }

      // Change the password
      user.password = newPassword;
      await user.save();

      // Respond with a success message
      res.status(200).json({ message: "Password change successful" });
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});
///////////////////////////////////////////////

// Route to invalidate a session
router.post("/logout", async (req, res) => {
  try {
    // Extract the token from the request body
    const { token } = req.body;

    let decoded;
    try {
      // Decode the token to get the user id
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(200).json({ error: "Invalid or expired token" });
    }

    if (!decoded) {
      return res.status(200).json({ error: "Invalid token" });
    }

    const username = decoded["username"];

    // Find the user with the ID extracted from the token
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(200).json({ error: "User not found" });
    }

    // Invalidate the user's token
    // You can't actually invalidate a JWT without additional measures
    // For simplicity, we'll just "pretend" to clear it by doing nothing
    // Ideally, you'd implement a token blacklist or switch to session management

    // Respond with a success message
    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

module.exports = router;
