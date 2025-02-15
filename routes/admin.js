const express = require("express");
const authMiddleware = require("../middleware/auth.js");
const adminMiddleware = require("../middleware/isAdmin.js");
const { Order } = require("../models/order.js");
const User = require("../models/user.js");
const { Testimonial } = require("../models/testimonial.js");

const router = express.Router();

// ✅ Get Admin Dashboard Stats
router.get("/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    console.log("Fetching admin stats...");

    // ✅ Fetch Stats Safely
    const totalOrders = await Order.countDocuments();
    const totalRevenue =
      (
        await Order.aggregate([
          { $group: { _id: null, total: { $sum: "$totalCents" } } },
        ])
      )[0]?.total / 100 || 0;

    const pendingTestimonials = await Testimonial.countDocuments({
      approved: false,
    });

    const totalUsers = await User.countDocuments(); // ✅ Should work now

    res
      .status(200)
      .json({ totalOrders, totalRevenue, pendingTestimonials, totalUsers });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Failed to fetch stats." });
  }
});

module.exports = router;
