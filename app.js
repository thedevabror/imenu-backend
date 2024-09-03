const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRouter");
const updateRoutes = require("./routes/updateRouter");
const restaurantRoutes = require("./routes/restaurantRouter");
const menuRoutes = require("./routes/menuRouter");
const menuItemsRoutes = require("./routes/menuItemRouter");
const orderRoutes = require("./routes/orderRouter");
require("dotenv").config();
const connectDB = require("./config/db");
const app = express();

connectDB();
app.use(express.json());
app.use(cors());
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/update", updateRoutes);
app.use("/api/v1/restaurant", restaurantRoutes);
app.use("/api/v1/menu", menuRoutes);
app.use("/api/v1/menu-items", menuItemsRoutes);
app.use("/api/v1/order", orderRoutes);

module.exports = app;
