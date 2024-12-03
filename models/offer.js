const mongoose = require("mongoose");
const Joi = require("joi");

// Offer Schema: Links to a Product with additional offer details
const offerSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  price: { type: Number, required: true, min: 0 }, // Discounted price
  originalPrice: { type: Number, required: true, min: 0 }, // Original price
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

// Offer Model
const Offer = mongoose.model("Offer", offerSchema);

// Validate Offer Input
function validateOffer(offer) {
  const schema = Joi.object({
    productId: Joi.string().required(), // Must be a valid ObjectId
    price: Joi.number().min(0).required(),
    originalPrice: Joi.number().min(0).required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
  });

  return schema.validate(offer);
}

module.exports = { Offer, validateOffer };
