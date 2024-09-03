const express = require("express");
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  // getRestaurantOrdersStatistics,
  getDailyStats,
  getWeeklyStats,
  getMonthlyStats,
} = require("../controllers/orderController");
const router = express.Router();

// Create a new order
router.post("/", createOrder);

router.get("/stats/daily", getDailyStats);
router.get("/stats/weekly", getWeeklyStats);
router.get("/stats/monthly", getMonthlyStats);

// Get all orders
router.get("/", getAllOrders);

// router.get("/:id/orders/statistics", getRestaurantOrdersStatistics);

// Get a specific order by ID
router.get("/:orderId", getOrderById);

// Update an order by ID
router.put("/:orderId", updateOrder);

// Delete an order by ID
router.delete("/:orderId", deleteOrder);

module.exports = router;
