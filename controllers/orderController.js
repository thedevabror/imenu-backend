const Orders = require("../models/Orders");
const MenuItems = require("../models/MenuItems");
const Restaurant = require("../models/Restaurant");
const { default: mongoose } = require("mongoose");

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { products, restaurantId, totalPrice, orderedBy } = req.body;

    // Validate restaurantId
    if (!mongoose.isValidObjectId(restaurantId)) {
      return res.status(400).json({ message: "Invalid Restaurant ID" });
    }

    // Validate and check each product
    for (const product of products) {
      const menuItem = await MenuItems.findById(product.productId);
      if (!menuItem) {
        return res
          .status(404)
          .json({ message: `Product not found: ${product.productId}` });
      }
    }

    // Check if the restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Create and save the order
    const newOrder = new Orders({
      products,
      restaurantId,
      totalPrice,
      orderedBy,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Order created successfully", savedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// const getRestaurantOrdersStatistics = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Validate restaurant ID
//     if (!mongoose.isValidObjectId(id)) {
//       return res.status(400).json({ message: "Invalid Restaurant ID" });
//     }

//     // Check if the restaurant exists
//     const restaurant = await Restaurant.findById(id);
//     if (!restaurant) {
//       return res.status(404).json({ message: "Restaurant not found" });
//     }

//     // Fetch and aggregate the orders data
//     const orders = await Orders.find({ restaurantId: id });

//     const statistics = {
//       totalOrders: orders.length,
//       waiterOrders: orders.filter((order) => order.orderedBy === "waiter")
//         .length,
//       customerOrders: orders.filter((order) => order.orderedBy === "customer")
//         .length,
//     };

//     res.status(200).json(statistics);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

const getStartOfPeriod = (date, period) => {
  const newDate = new Date(date);
  switch (period) {
    case "day":
      newDate.setHours(0, 0, 0, 0);
      break;
    case "week":
      const day = newDate.getDay();
      const diff = newDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get to the start of the week (Monday)
      newDate.setDate(diff);
      newDate.setHours(0, 0, 0, 0);
      break;
    case "month":
      newDate.setDate(1);
      newDate.setHours(0, 0, 0, 0);
      break;
  }
  return newDate;
};

// Get daily statistics
const getDailyStats = async (req, res) => {
  try {
    const { restaurantId } = req.query;
    const today = new Date();
    const startOfDay = getStartOfPeriod(today, "day");

    const stats = await Orders.aggregate([
      {
        $match: {
          restaurantId: new mongoose.Types.ObjectId(restaurantId),
          createdAt: { $gte: startOfDay, $lt: today },
        },
      },
      {
        $group: {
          _id: "$orderedBy",
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get weekly statistics
const getWeeklyStats = async (req, res) => {
  try {
    const { restaurantId } = req.query;
    const today = new Date();
    const startOfWeek = getStartOfPeriod(today, "week");

    const stats = await Orders.aggregate([
      {
        $match: {
          restaurantId: new mongoose.Types.ObjectId(restaurantId),
          createdAt: { $gte: startOfWeek, $lt: today },
        },
      },
      {
        $group: {
          _id: "$orderedBy",
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get monthly statistics
const getMonthlyStats = async (req, res) => {
  try {
    const { restaurantId } = req.query;
    const today = new Date();
    const startOfMonth = getStartOfPeriod(today, "month");

    const stats = await Orders.aggregate([
      {
        $match: {
          restaurantId: new mongoose.Types.ObjectId(restaurantId),
          createdAt: { $gte: startOfMonth, $lt: today },
        },
      },
      {
        $group: {
          _id: "$orderedBy",
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.find()
      .populate("products.productId")
      .populate("restaurantId");
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a specific order by ID
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Orders.findById(orderId)
      .populate("products.productId")
      .populate("restaurantId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Update an order by ID
const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { products, status, totalPrice } = req.body;

    const order = await Orders.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the order fields
    if (products) {
      order.products = products;
    }
    if (status) {
      order.status = status;
    }
    if (totalPrice) {
      order.totalPrice = totalPrice;
    }

    const updatedOrder = await order.save();
    res
      .status(200)
      .json({ message: "Order updated successfully", updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete an order by ID
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Orders.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createOrder,
  // getRestaurantOrdersStatistics,
  getDailyStats,
  getWeeklyStats,
  getMonthlyStats,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
