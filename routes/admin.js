const express = require("express");
const authMiddleware = require("../middleware/auth.js");
const adminMiddleware = require("../middleware/isAdmin.js");
const { Order } = require("../models/order.js");
const User = require("../models/user.js");
const { Testimonial } = require("../models/testimonial.js");
const mongoose = require("mongoose");
const { Parser } = require("json2csv");

const router = express.Router();

// ✅ Get Admin Dashboard Stats
router.get("/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    console.log("Fetching admin stats...");

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

    const totalUsers = await User.countDocuments();

    res
      .status(200)
      .json({ totalOrders, totalRevenue, pendingTestimonials, totalUsers });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Failed to fetch stats." });
  }
});

// ✅ Sales & Orders Trend (Last 30 Days)
router.get(
  "/stats/orders-trend",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);

      const salesTrend = await Order.aggregate([
        { $match: { datePlaced: { $gte: last30Days } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$datePlaced" } },
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: "$totalCents" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      res.status(200).json(salesTrend);
    } catch (error) {
      console.error("Error fetching orders trend:", error);
      res.status(500).json({ message: "Failed to fetch orders trend." });
    }
  }
);

// ✅ Top Selling Products
router.get(
  "/stats/top-products",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const topProducts = await Order.aggregate([
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.productId",
            totalSold: { $sum: "$items.quantity" },
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        { $unwind: "$productInfo" },
        {
          $project: {
            name: "$productInfo.name",
            totalSold: 1,
          },
        },
      ]);

      res.status(200).json(topProducts);
    } catch (error) {
      console.error("Error fetching top products:", error);
      res.status(500).json({ message: "Failed to fetch top products." });
    }
  }
);

// ✅ Customer Insights (New vs Returning Customers)
router.get(
  "/stats/customers",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const newCustomers = await User.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      });
      const returningCustomers = await Order.distinct("userId");

      res
        .status(200)
        .json({ newCustomers, returningCustomers: returningCustomers.length });
    } catch (error) {
      console.error("Error fetching customer insights:", error);
      res.status(500).json({ message: "Failed to fetch customer insights." });
    }
  }
);

// ✅ Sales by Category
router.get(
  "/stats/sales-category",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const categorySales = await Order.aggregate([
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.category",
            totalSales: { $sum: "$items.quantity" },
          },
        },
        { $sort: { totalSales: -1 } },
      ]);

      res.status(200).json(categorySales);
    } catch (error) {
      console.error("Error fetching category sales:", error);
      res.status(500).json({ message: "Failed to fetch category sales." });
    }
  }
);

// ✅ CSV Export Endpoint
router.get(
  "/sales/export",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const query = {};

      if (startDate && endDate) {
        query.datePlaced = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      const orders = await Order.find(query).populate(
        "items.productId",
        "name"
      );

      const salesData = orders.map((order) => ({
        datePlaced: order.datePlaced,
        totalAmount: order.totalCents / 100,
        items: order.items.map((item) => item.productId.name).join(", "),
      }));

      const parser = new Parser();
      const csv = parser.parse(salesData);

      res.header("Content-Type", "text/csv");
      res.attachment("sales_report.csv");
      res.send(csv);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      res.status(500).json({ message: "Failed to export sales report." });
    }
  }
);

module.exports = router;
