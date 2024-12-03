const express = require("express");
const { Offer, validateOffer } = require("../models/offer");
const { Product } = require("../models/product");
const router = express.Router();

// GET: Fetch active offers and their associated product details
router.get("/", async (req, res) => {
  try {
    // Fetch current date to filter active offers
    const now = new Date();

    // Find active offers and populate product details
    const offers = await Offer.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).populate("productId"); // Populate the linked product details

    // Format response with product and offer details
    const response = offers.map((offer) => ({
      id: offer._id,
      product: {
        id: offer.productId._id,
        name: offer.productId.name,
        image: offer.productId.image,
        rating: offer.productId.rating,
      },
      price: offer.price,
      originalPrice: offer.originalPrice,
    }));

    res.json(response);
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({ error: "Failed to fetch offers" });
  }
});

// POST: Create a new offer
router.post("/", async (req, res) => {
  const { error } = validateOffer(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const offer = new Offer(req.body);
    await offer.save();
    res.status(201).json({ message: "Offer created successfully", offer });
  } catch (error) {
    console.error("Error creating offer:", error);
    res.status(500).json({ error: "Failed to create offer" });
  }
});

module.exports = router;
