const express = require("express");
const router = express.Router();
const {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  getOwnRestaurants,
} = require("../controllers/restaurantController");

// Route to create a new restaurant
router.post("/add", createRestaurant);

// Route to get all restaurants
router.get("/", getAllRestaurants);

router.get("/:owner_id", getOwnRestaurants);

// Route to get a specific restaurant by ID
router.get("/single/:id", getRestaurantById);

// Route to update a specific restaurant by ID
router.put("/:restaurantId", updateRestaurant);

// Route to delete a specific restaurant by ID
router.delete("/:restaurantId", deleteRestaurant);

module.exports = router;
