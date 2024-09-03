const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// Register a new user
router.post("/register", registerUser);

// Login a user
router.post("/login", loginUser);

// Get all users
router.get("/", getAllUsers);

// Get a specific user by ID
router.get("/:userId", getUserById);

// Update a user by ID
router.put("/:userId", updateUser);

// Delete a user by ID
router.delete("/:userId", deleteUser);

module.exports = router;
