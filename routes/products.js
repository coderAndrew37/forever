const express = require("express");
const { Product, validateProduct } = require("../models/product");
const authMiddleware = require("../middleware/auth");
const adminMiddleware = require("../middleware/isAdmin");
const router = express.Router();
const mongoose = require("mongoose");

// Define specific routes first
router.get("/suggestions", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ message: "Query is required" });
  }

  try {
    const suggestions = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { keywords: { $regex: query, $options: "i" } },
      ],
    })
      .limit(5) // Limit to 5 suggestions for performance
      .select("name"); // Only return product name for suggestions

    res.json(suggestions);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

//add endpoint to search products by name
router.get("/search", async (req, res) => {
  const query = req.query.q;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    console.log("Search query:", query);

    const products = await Product.find({ $text: { $search: query } })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("name image rating priceCents");
    const totalProducts = await Product.countDocuments({
      $text: { $search: query },
    });

    const totalPages = Math.ceil(totalProducts / limit);

    const sanitizedProducts = products.map((product) => ({
      _id: product._id,
      name: product.name || "Unnamed Product",
      image: product.image || "images/default-product.png",
      rating: {
        stars: product.rating?.stars || 0,
        count: product.rating?.count || 0,
      },
      priceCents: product.priceCents || 0,
    }));

    res.status(200).json({
      products: sanitizedProducts,
      currentPage: page,
      totalPages,
      totalProducts,
    });
  } catch (error) {
    console.error("Error during product search:", error);
    res.status(500).json({ error: "Server error during search" });
  }
});

// Add endpoint to fetch products by a list of IDs
router.get("/by-ids", async (req, res) => {
  const ids = req.query.ids ? req.query.ids.split(",") : [];

  if (ids.length === 0) {
    return res.status(400).json({ error: "No IDs provided" });
  }

  const validObjectIds = ids.filter(mongoose.Types.ObjectId.isValid);

  if (validObjectIds.length === 0) {
    return res.status(400).json({ error: "No valid IDs provided." });
  }

  try {
    const products = await Product.find({ _id: { $in: validObjectIds } });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products by IDs:", error);
    res.status(500).json({ error: "Failed to fetch products." });
  }
});

// Dynamic route for fetching a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found." });
    res.json(product);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ error: "Failed to fetch product details." });
  }
});

// Get all products

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1; // Default to page 1
  const limit = parseInt(req.query.limit, 10) || 16; // Default to 15 items per page
  const categorySlug = req.query.category; // Get the `category` parameter from the query string

  try {
    const filter = {}; // Initialize an empty filter

    // If a category is specified, filter by `categorySlug`
    if (categorySlug) {
      filter.categorySlug = categorySlug; // Ensure the field in the database is `categorySlug`
    }

    // Step 1: Count total matching products
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    // Step 2: Retrieve products with pagination
    const products = await Product.find(filter)
      .skip((page - 1) * limit) // Skip the previous pages
      .limit(limit); // Limit to the number of items per page

    // Step 3: Return the products and pagination info
    res.json({
      products,
      currentPage: page,
      totalPages,
      totalProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Add the POST route to create a new product
// ✅ Add a New Product (Admin Only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const product = new Product(req.body);
    await product.save();

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Failed to add product" });
  }
});

// ✅ Update an Existing Product (Admin Only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid product ID." });
  }

  const { error } = validateProduct(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ error: "Product not found." });

    res.json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product." });
  }
});

// ✅ Delete a Product (Admin Only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid product ID." });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ error: "Product not found." });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product." });
  }
});

module.exports = router;
