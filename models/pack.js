const mongoose = require("mongoose");
const Joi = require("joi");

// Define the schema for the pack model
const packSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  detailedDescription: { type: String },
  packImage: { type: String, required: true }, // Store image path as a string
  benefits: [
    {
      benefit: { type: String, required: true },
      icon: { type: String, required: true },
    },
  ],
  productIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
    required: true,
  },
});

// Create the mongoose model
const Pack = mongoose.model("Pack", packSchema);

// Define the Joi validation schema for the pack
const packValidationSchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),
  description: Joi.string().required(),
  detailedDescription: Joi.string(),
  packImage: Joi.string().required(), // Validate as a required string (path)
  benefits: Joi.array()
    .items(
      Joi.object({
        benefit: Joi.string().required(),
        icon: Joi.string().required(),
      })
    )
    .required(),
  productIds: Joi.array().items(Joi.string()).required(),
});

module.exports = { Pack, packValidationSchema };
