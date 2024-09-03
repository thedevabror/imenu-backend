const Restaurant = require("../models/Restaurant");
const slugify = require("slugify");
const Users = require("../models/Users");

// Create a new restaurant
const createRestaurant = async (req, res) => {
  const { name, location, contact_info, logo, owner_id } = req.body;

  try {
    const restaurantExists = await Restaurant.findOne({ name });
    if (restaurantExists) {
      return res.status(400).json({ message: "Restaurant already exists" });
    }

    const user = await Users.findById(owner_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const newRestaurant = new Restaurant({
      name,
      location,
      contact_info,
      logo,
      owner_id,
      slug,
    });

    const savedRestaurant = await newRestaurant.save();

    // Add the restaurant ID to the user's restaurantId array
    user.restaurantId.push(savedRestaurant._id);
    await user.save();

    res.status(201).json(savedRestaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all restaurants
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getOwnRestaurants = async (req, res) => {
  try {
    const { owner_id } = req.params;

    const restaurant = await Restaurant.find({ owner_id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a specific restaurant by ID
const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a restaurant by ID
const updateRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { name, location, contact_info, logo } = req.body;

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      {
        name,
        location,
        contact_info,
        logo,
        slug: slugify(name, { lower: true, strict: true }),
      },
      { new: true, runValidators: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res
      .status(200)
      .json({ message: "Restaurant updated successfully", updatedRestaurant });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete  restaurant
const deleteRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const deletedRestaurant = await Restaurant.findByIdAndDelete(restaurantId);
    if (!deletedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    await Users.updateMany(
      { restaurantId: restaurantId },
      { $pull: { restaurantId: restaurantId } }
    );
    const restaurants = await Restaurant.find();
    res.status(200).json({ message: "Restaurant deleted successfully", restaurants });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getOwnRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
};
