const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
  contact_info: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: false,
    default:
      "https://image.similarpng.com/very-thumbnail/2021/07/Chef-restaurant-logo-illustrations-template-on-transparent-background-PNG.png",
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  menu_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      required: false,
      default: [],
    },
  ],
  staffs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staffs",
      required: false,
      default: [],
    },
  ],
  slug: {
    type: String,
    unique: true,
  },
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
