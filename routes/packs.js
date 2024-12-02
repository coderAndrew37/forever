const express = require("express");
const { Pack } = require("../models/pack");
const { Product } = require("../models/product");
const router = express.Router();

router.get("/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    // Find the pack by slug
    const pack = await Pack.findOne({ slug }).populate("productIds");

    if (!pack) {
      return res.status(404).json({ error: "Pack not found" });
    }

    res.json({
      name: pack.name,
      description: pack.description,
      detailedDescription: pack.detailedDescription,
      benefits: pack.benefits,
      products: pack.productIds,
    });
  } catch (error) {
    console.error("Error fetching pack details:", error);
    res.status(500).json({ error: "Failed to fetch pack details" });
  }
});

router.get("/", async (req, res) => {
  try {
    const packs = await Pack.find().select("name slug description");
    res.json(packs);
  } catch (error) {
    console.error("Error fetching packs:", error);
    res.status(500).json({ error: "Failed to fetch packs" });
  }
});

module.exports = router;
