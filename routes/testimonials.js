const express = require("express");
const { Testimonial, validateTestimonial } = require("../models/testimonial");
const multer = require("multer");
const router = express.Router();

// ✅ Multer Setup for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ Get Testimonials (Only 3★ and Above, Approved, Sorted by Likes)
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find({
      rating: { $gte: 3 },
      approved: true,
    })
      .sort({ likes: -1, createdAt: -1 }) // Most liked first
      .limit(10);
    res.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ error: "Failed to fetch testimonials." });
  }
});

// ✅ Submit a New Testimonial with Optional Photo Upload
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const { error, value } = validateTestimonial(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const testimonial = new Testimonial({
      ...value,
      photo: req.file ? `/uploads/${req.file.filename}` : "",
    });
    await testimonial.save();
    res
      .status(201)
      .json({ message: "Testimonial submitted. Pending approval!" });
  } catch (error) {
    console.error("Error submitting testimonial:", error);
    res.status(500).json({ error: "Failed to submit testimonial." });
  }
});

// ✅ Like a Testimonial
router.post("/:id/like", async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!testimonial)
      return res.status(404).json({ error: "Testimonial not found." });
    res.json({ message: "Liked!", likes: testimonial.likes });
  } catch (error) {
    console.error("Error liking testimonial:", error);
    res.status(500).json({ error: "Failed to like testimonial." });
  }
});

// ✅ Admin Approval for Testimonials
router.put("/:id/approve", async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!testimonial)
      return res.status(404).json({ error: "Testimonial not found." });
    res.json({ message: "Testimonial approved!" });
  } catch (error) {
    console.error("Error approving testimonial:", error);
    res.status(500).json({ error: "Failed to approve testimonial." });
  }
});

module.exports = router;
