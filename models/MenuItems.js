const mongoose = require("mongoose");

const MenuItemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
    default: null,
  },
  photo: {
    type: String,
    required: false,
    default: "https://www.themealdb.com/images/media/meals/1529444113.jpg",
  },
  price: {
    type: String,
    required: true,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  menuId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
    required: true,
  },
});

module.exports = mongoose.model("MenuItems", MenuItemsSchema);
