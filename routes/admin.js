const express = require("express");
const authMiddleware = require("../middleware/auth.js");
const adminMiddleware = require("../middleware/isAdmin.js");
const { Order } = require("../models/order.js");
const { User } = require("../models/user.js");
const { Testimonial } = require("../models/testimonial.js");

const router = express.Router();

// ✅ Get Admin Dashboard Stats
router.get("/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Total Orders & Revenue
    const orders = await Order.find();
    const totalOrders = orders.length;
    const totalRevenue =
      orders.reduce((sum, order) => sum + order.totalCents, 0) / 100;

    // Pending Testimonials
    const pendingTestimonials = await Testimonial.countDocuments({
      approved: false,
    });

    // Total Users
    const totalUsers = await User.countDocuments();

    res
      .status(200)
      .json({ totalOrders, totalRevenue, pendingTestimonials, totalUsers });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Failed to fetch stats." });
  }
});

module.exports = router;
