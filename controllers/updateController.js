const Users = require("../models/Users");
const Restaurant = require("../models/Restaurant");
const Menu = require("../models/Menu");

const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, email, password, role, restaurantId } = req.body;

    let user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    user.role = role || user.role;
    user.restaurantId = restaurantId || user.restaurantId;

    await user.save();

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const addRestaurant = async (req, res) => {
  try {
    const { userId } = req.params;
    const { restaurantId } = req.body;

    const user = await Users.findById(userId);
    const foundedRestaurant = await Restaurant.findById(restaurantId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!foundedRestaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    if (!foundedRestaurant.owner_id.equals(userId)) {
      return res.status(403).json({
        message: "You do not own this restaurant",
      });
    }

    user.restaurantId = restaurantId;
    await user.save();

    res.status(200).json({
      message: "Restaurant added successfully",
      restaurantId: user.restaurantId,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const addMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { menu_id } = req.body;

    const foundedRestaurant = await Restaurant.findById(restaurantId);
    const foundedMenu = await Menu.findById(menu_id);

    if (!foundedRestaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    if (!foundedMenu.restaurantId.equals(restaurantId)) {
      return res.status(403).json({
        message: "You do not own this restaurant",
      });
    }

    foundedRestaurant.menu_id = menu_id;
    await foundedRestaurant.save();

    res.status(200).json({
      message: "Menu added successfully",
      menu_id: foundedRestaurant.menu_id,
    });
  } catch (error) {}
};

module.exports = {
  updateUser,
  addRestaurant,
  addMenu,
};
