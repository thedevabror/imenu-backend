const express = require("express");
const {
  updateUser,
  addRestaurant,
  addMenu,
} = require("../controllers/updateController");
const router = express.Router();

router.put("/user/:id", updateUser);

// router.put("")

module.exports = router;
