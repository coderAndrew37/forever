const express = require("express");
const { Pack, packValidationSchema } = require("../models/pack");
const { Product } = require("../models/product");
const router = express.Router();

// Fetch all packs with products
router.get("/", async (req, res) => {
  try {
    const packs = await Pack.find().populate(
      "productIds",
      "name image priceCents description"
    );
    res.json(packs);
  } catch (error) {
    console.error("Error fetching packs:", error);
    res.status(500).json({ error: "Failed to fetch packs" });
  }
});

// Fetch a specific pack by slug
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const pack = await Pack.findOne({ slug }).populate(
      "productIds",
      "name image priceCents description"
    );

    if (!pack) {
      return res.status(404).json({ error: "Pack not found" });
    }

    res.json(pack);
  } catch (error) {
    console.error("Error fetching pack details:", error);
    res.status(500).json({ error: "Failed to fetch pack details" });
  }
});

// Add a new pack
router.post("/", async (req, res) => {
  const { error } = packValidationSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const pack = new Pack(req.body);
    await pack.save();
    res.status(201).json({ message: "Pack created successfully", pack });
  } catch (error) {
    console.error("Error creating pack:", error);
    res.status(500).json({ error: "Failed to create pack" });
  }
});

// Update a pack
router.put("/:slug", async (req, res) => {
  const { error } = packValidationSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { slug } = req.params;

  try {
    const pack = await Pack.findOneAndUpdate({ slug }, req.body, { new: true });

    if (!pack) {
      return res.status(404).json({ error: "Pack not found" });
    }

    res.json({ message: "Pack updated successfully", pack });
  } catch (error) {
    console.error("Error updating pack:", error);
    res.status(500).json({ error: "Failed to update pack" });
  }
});

// Delete a pack
router.delete("/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const pack = await Pack.findOneAndDelete({ slug });

    if (!pack) {
      return res.status(404).json({ error: "Pack not found" });
    }

    res.json({ message: "Pack deleted successfully" });
  } catch (error) {
    console.error("Error deleting pack:", error);
    res.status(500).json({ error: "Failed to delete pack" });
  }
});

module.exports = router;
