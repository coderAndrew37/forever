const mongoose = require("mongoose");
const Joi = require("joi");

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 50 },
  text: { type: String, required: true, minlength: 10, maxlength: 500 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  photo: { type: String, default: "" }, // Image URL
  video: { type: String, default: "" }, // Video URL
  likes: { type: Number, default: 0 },
  approved: { type: Boolean, default: false }, // Admin must approve
  createdAt: { type: Date, default: Date.now },
});

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

function validateTestimonial(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    text: Joi.string().min(10).max(500).required(),
    rating: Joi.number().min(3).max(5).required(), // Only 3★ and above
    photo: Joi.string().allow(""), // Optional photo URL
    video: Joi.string().allow(""), // Optional video URL
  });
  return schema.validate(data);
}

module.exports = { Testimonial, validateTestimonial };
