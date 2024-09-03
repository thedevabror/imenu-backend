const express = require("express");
const router = express.Router();
const {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  getMenuItems,
} = require("../controllers/menuItemController");

// Route to create a new item
router.post("/", createItem);

// Route to get all items
router.get("/:menuId", getMenuItems);

// Route to get a specific item by ID
router.get("/single/:itemId", getItemById);

// Route to update a specific item by ID
router.put("/:itemId", updateItem);

// Route to delete a specific item by ID
router.delete("/:itemId", deleteItem);

module.exports = router;
