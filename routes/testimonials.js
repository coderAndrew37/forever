const express = require("express");
const { Testimonial, validateTestimonial } = require("../models/testimonial");
const multer = require("multer");
const router = express.Router();

// ✅ Multer Storage Setup for Images & Videos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ Get All Testimonials for Admin (Both Approved & Pending)
router.get("/admin", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 }); // No approval filter
    res.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials for admin:", error);
    res.status(500).json({ error: "Failed to fetch testimonials." });
  }
});

// ✅ Get Testimonials (Only Approved, 3★ and Above)
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

// ✅ Submit a New Testimonial (With Image/Video Upload)
router.post(
  "/",
  upload.fields([{ name: "photo" }, { name: "video" }]),
  async (req, res) => {
    try {
      const { error, value } = validateTestimonial(req.body);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      const testimonial = new Testimonial({
        ...value,
        photo: req.files.photo ? `/uploads/${req.files.photo[0].filename}` : "",
        video: req.files.video ? `/uploads/${req.files.video[0].filename}` : "",
      });
      await testimonial.save();
      res
        .status(201)
        .json({ message: "Testimonial submitted. Pending approval!" });
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      res.status(500).json({ error: "Failed to submit testimonial." });
    }
  }
);

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

// ✅ Delete a Testimonial
router.delete("/:id", async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found." });
    }
    res.json({ message: "Testimonial deleted successfully!" });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    res.status(500).json({ error: "Failed to delete testimonial." });
  }
});

module.exports = router;
