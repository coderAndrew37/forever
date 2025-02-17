const express = require("express");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/auth.js");
const adminMiddleware = require("../middleware/isAdmin.js");
const { Order, validateOrder } = require("../models/order.js");
const { Product } = require("../models/product.js");
const { sendOrderConfirmationEmail } = require("../services/emailService.js");
const { Parser } = require("json2csv"); // For CSV Export

const router = express.Router();

// ✅ Create a new order
router.post("/", authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const { items, name, email, phone, address, paymentMethod } = req.body;

  const { error } = validateOrder({
    userId,
    items,
    totalCents: req.body.totalCents,
    name,
    email,
    phone,
    address,
    paymentMethod,
  });
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    let totalCents = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }
      const itemTotal = product.priceCents * item.quantity;
      totalCents += itemTotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        priceCents: product.priceCents,
      });
    }

    const order = new Order({
      userId,
      items: orderItems,
      totalCents,
      name,
      email,
      phone,
      address,
      paymentMethod,
    });

    await order.save();
    await sendOrderConfirmationEmail(email, order);

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Get orders for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  try {
    const orders = await Order.find({ userId }).populate(
      "items.productId",
      "name image priceCents"
    );
    res.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Get a single order by ID
router.get("/:orderId", authMiddleware, async (req, res) => {
  const { orderId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ message: "Invalid Order ID" });
  }

  try {
    const order = await Order.findById(orderId).populate(
      "items.productId",
      "name image priceCents"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// ✅ Admin route to fetch all orders with pagination & filtering
router.get("/admin", authMiddleware, adminMiddleware, async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const status = req.query.status;
  const search = req.query.search;

  try {
    let filter = {};

    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    const totalOrders = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ datePlaced: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("items.productId", "name image priceCents");

    res.status(200).json({
      orders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Update order status (Admin)
router.put(
  "/admin/:orderId",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const { status } = req.body;

    if (!["Preparing", "Shipped", "Delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    try {
      const order = await Order.findById(req.params.orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found." });
      }

      order.status = status;
      await order.save();

      res.status(200).json({ message: "Order status updated successfully." });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

// ✅ Delete an order (Admin only)
router.delete(
  "/admin/:orderId",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const order = await Order.findByIdAndDelete(req.params.orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found." });
      }

      res.status(200).json({ message: "Order deleted successfully." });
    } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

// ✅ Export Orders as CSV (Admin only)
router.get(
  "/admin/export",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const orders = await Order.find().populate("items.productId", "name");

      const csvFields = [
        "Order ID",
        "Customer Name",
        "Email",
        "Total Price",
        "Status",
        "Items",
      ];
      const csvData = orders.map((order) => ({
        "Order ID": order._id,
        "Customer Name": order.name,
        Email: order.email,
        "Total Price": (order.totalCents / 100).toFixed(2),
        Status: order.status || "Preparing",
        Items: order.items
          .map((item) => `${item.quantity} x ${item.name}`)
          .join(", "),
      }));

      const parser = new Parser({ fields: csvFields });
      const csv = parser.parse(csvData);

      res.header("Content-Type", "text/csv");
      res.attachment("orders.csv");
      res.send(csv);
    } catch (error) {
      console.error("Error exporting orders:", error);
      res.status(500).json({ message: "Failed to export orders." });
    }
  }
);

module.exports = router;
