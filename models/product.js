const mongoose = require("mongoose");
const Joi = require("joi");

const ratingSchema = new mongoose.Schema({
  stars: { type: Number, required: true, min: 0, max: 5 },
  count: { type: Number, required: true, min: 0 },
});

const benefitSchema = new mongoose.Schema({
  icon: { type: String, required: true },
  text: { type: String, required: true },
});

const productSchema = new mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true, minlength: 3, maxlength: 100 },
  rating: { type: ratingSchema, required: true },
  priceCents: { type: Number, required: true, min: 0 },
  description: { type: String, required: true },
  benefits: { type: [benefitSchema], required: true },
  gallery: { type: [String], default: [] },
  categorySlug: { type: String, required: true },
  keywords: { type: [String], default: [] },
  isOnOffer: { type: Boolean, default: false },
});

const Product = mongoose.model("Product", productSchema);

function validateProduct(product) {
  const schema = Joi.object({
    image: Joi.string().required(),
    name: Joi.string().min(3).max(100).required(),
    rating: Joi.object({
      stars: Joi.number().min(0).max(5).required(),
      count: Joi.number().min(0).required(),
    }).required(),
    priceCents: Joi.number().min(0).required(),
    description: Joi.string().required(),
    benefits: Joi.array()
      .items(
        Joi.object({
          icon: Joi.string().required(),
          text: Joi.string().required(),
        })
      )
      .required(),
    gallery: Joi.array().items(Joi.string()).optional(),
    categorySlug: Joi.string().required(),
    keywords: Joi.array().items(Joi.string()).optional(),
    isOnOffer: Joi.boolean().optional(),
  });

  return schema.validate(product);
}

module.exports = {
  Product,
  validateProduct,
};
