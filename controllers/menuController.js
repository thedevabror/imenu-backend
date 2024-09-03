const Menu = require("../models/Menu");
const Restaurant = require("../models/Restaurant");
const mongoose = require("mongoose");

// Create a new menu
const createMenu = async (req, res) => {
  const { name, description, menuItemsId, restaurantId, ownerId } = req.body;

  try {
    // Validate restaurantId
    if (!mongoose.isValidObjectId(restaurantId)) {
      return res.status(400).json({ message: "Invalid Restaurant ID" });
    }

    // Check if the restaurant exists
    const foundedRestaurant = await Restaurant.findById(restaurantId);
    if (!foundedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    if (!foundedRestaurant._id.equals(ownerId)) {
      return res.status(403).json({
        message: "You do not own this restaurant",
      });
    }

    // Create and save the new menu
    const newMenu = new Menu({
      name,
      description,
      menuItemsId,
      restaurantId,
    });

    const menu_id = await newMenu.save();
    foundedRestaurant.menu_id.push(menu_id._id);
    await foundedRestaurant.save();
    res.status(201).json({ message: "Menu created successfully", menu_id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all menus for a restaurant
const getRestaurantMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const menus = await Menu.find({ restaurantId });

    if (!menus || menus.length === 0) {
      return res.status(404).json({
        message: `No menus found for restaurant with ID: ${restaurantId}`,
      });
    }

    res.status(200).json(menus);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getOwnMenu = async (req, res) => {
  try {
    const { owner_id } = req.params;

    const menu = await Menu.find({ owner_id });
    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.status(200).json(menu);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a specific menu by ID
const getMenuById = async (req, res) => {
  try {
    const { menuId } = req.params;

    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.status(200).json(menu);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a menu by ID
const updateMenu = async (req, res) => {
  try {
    const { menuId } = req.params;
    const { name, description, menuItemsId } = req.body;

    const updatedMenu = await Menu.findByIdAndUpdate(
      menuId,
      { name, description, menuItemsId },
      { new: true, runValidators: true }
    );

    if (!updatedMenu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.status(200).json({ message: "Menu updated successfully", updatedMenu });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a menu by ID
const deleteMenu = async (req, res) => {
  try {
    const { menuId } = req.params;

    const deletedMenu = await Menu.findByIdAndDelete(menuId);
    if (!deletedMenu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    // Optionally, remove the menu ID from the restaurant's menu_id array
    await Restaurant.updateMany(
      { menu_id: menuId },
      { $pull: { menu_id: menuId } }
    );

    res.status(200).json({ message: "Menu deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createMenu,
  getRestaurantMenu,
  getOwnMenu,
  getMenuById,
  updateMenu,
  deleteMenu,
};
