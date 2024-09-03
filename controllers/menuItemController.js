const Restaurant = require("../models/Restaurant");
const Menu = require("../models/Menu");
const mongoose = require("mongoose");
const MenuItems = require("../models/MenuItems");

// Create Item
const createItem = async (req, res) => {
  try {
    const { name, description, photo, price, restaurantId, menuId } = req.body;

    // Validate restaurantId and menuId
    if (!mongoose.isValidObjectId(restaurantId)) {
      return res.status(400).json({ message: "Invalid Restaurant ID" });
    }
    if (!mongoose.isValidObjectId(menuId)) {
      return res.status(400).json({ message: "Invalid Menu ID" });
    }

    // Check if the restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Check if the menu exists and belongs to the restaurant
    const menu = await Menu.findOne({ _id: menuId, restaurantId });
    if (!menu) {
      return res
        .status(404)
        .json({ message: "Menu not found for this restaurant" });
    }

    // Create a new item
    const newItem = new MenuItems({
      name,
      description,
      photo,
      price,
      restaurantId,
      menuId,
    });

    // Save the item
    const savedItem = await newItem.save();

    // Add the new item to the menu's items array
    menu.menuItemsId.push(savedItem._id);
    await menu.save();

    res.status(201).json({ message: "Item created successfully", savedItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get All Items for a Specific Menu
const getMenuItems = async (req, res) => {
  try {
    const { menuId } = req.params;

    // Validate menuId
    if (!mongoose.isValidObjectId(menuId)) {
      return res.status(400).json({ message: "Invalid Menu ID" });
    }

    // Get the items from the menu
    const items = await MenuItems.find({ menuId });

    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a Specific Item by ID
const getItemById = async (req, res) => {
  try {
    const { itemId } = req.params;

    // Validate itemId
    if (!mongoose.isValidObjectId(itemId)) {
      return res.status(400).json({ message: "Invalid Item ID" });
    }

    const item = await MenuItems.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Update an Item
const updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, description, photo, price } = req.body;

    // Validate itemId
    if (!mongoose.isValidObjectId(itemId)) {
      return res.status(400).json({ message: "Invalid Item ID" });
    }

    // Update the item
    const updatedItem = await MenuItems.findByIdAndUpdate(
      itemId,
      { name, description, photo, price },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item updated successfully", updatedItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete an Item
const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    // Validate itemId
    if (!mongoose.isValidObjectId(itemId)) {
      return res.status(400).json({ message: "Invalid Item ID" });
    }

    // Delete the item
    const deletedItem = await MenuItems.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Also remove the item from the menu's items array
    await Menu.updateOne(
      { _id: deletedItem.menuId },
      { $pull: { menuItemsId: itemId } }
    );

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createItem,
  getMenuItems,
  getItemById,
  updateItem,
  deleteItem,
};
