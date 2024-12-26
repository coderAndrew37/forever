const express = require("express");
const { Product, validateProduct } = require("../models/product");
const router = express.Router();
const mongoose = require("mongoose");

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

// Get product by ID (this must come after /by-ids)
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

router.get("/search", async (req, res) => {
  const query = req.query.q;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  if (!query) {
    return res.status(400).json({ message: "Query is required" });
  }

  try {
    // Search products with $text indexing
    const products = await Product.find({ $text: { $search: query } })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("name image rating priceCents") // Include required fields only
      .exec();

    const totalProducts = await Product.countDocuments({
      $text: { $search: query },
    });
    const totalPages = Math.ceil(totalProducts / limit);

    // Provide default values for any missing fields
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

    if (sanitizedProducts.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.json({
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

// Add the POST route to create a new product
router.post("/", async (req, res) => {
  // Validate product data
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    // Create a new product with validated data
    const product = new Product(req.body);
    await product.save();

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Failed to add product" });
  }
});

// Add a new route in API for suggestions
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

module.exports = router;
