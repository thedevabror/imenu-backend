const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "kassir", "afitsiant"],
    default: "afitsiant",
  },
  restaurantId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: false,
      default: null,
    },
  ],
});

module.exports = mongoose.model("Users", UserSchema);
