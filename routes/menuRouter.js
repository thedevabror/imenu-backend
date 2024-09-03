const express = require("express");
const router = express.Router();
const {
  createMenu,
  getRestaurantMenu,
  getMenuById,
  updateMenu,
  deleteMenu,
  getOwnMenu,
} = require("../controllers/menuController");

// Route to create a new menu
router.post("/", createMenu);

router.get("/:owner_id", getOwnMenu);

// Route to get all menus for a restaurant
router.get("/single/:restaurantId", getRestaurantMenu);

// Route to get a specific menu by ID
router.get("/menu/:menuId", getMenuById);

// Route to update a specific menu by ID
router.put("/menu/:menuId", updateMenu);

// Route to delete a specific menu by ID
router.delete("/menu/:menuId", deleteMenu);

module.exports = router;
