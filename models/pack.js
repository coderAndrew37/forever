const mongoose = require("mongoose");
const Joi = require("joi");

const packSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  detailedDescription: { type: String },
  benefits: { type: [String], required: true },
  productIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
    required: true,
  },
});

// Create a Pack model

const Pack = mongoose.model("Pack", packSchema);

//validate the packs using joi

const packValidationSchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),
  description: Joi.string().required(),
  detailedDescription: Joi.string(),
  benefits: Joi.array().items(Joi.string()).required(),
  productIds: Joi.array().items(Joi.string()).required(),
});

// Use module.exports to export the objects

module.exports = { Pack, packValidationSchema };
