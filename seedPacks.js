const mongoose = require("mongoose");
const { Pack } = require("./models/pack"); // Import the Pack model
require("dotenv").config();
require("./startup/db")(); // Connect to the database

// Array of new packs
const packs = [
  {
    name: "Infinite Skincare Pack",
    slug: "infinite",
    description:
      "A premium skincare regimen for age-defying, youthful-looking skin.",
    detailedDescription:
      "The Infinite Skincare Pack is a comprehensive anti-aging skincare system that uses the power of Aloe Vera combined with cutting-edge ingredients to nourish, hydrate, and protect the skin. This pack is designed to reduce the appearance of fine lines and wrinkles, promote a smoother and more even skin tone, and provide long-lasting hydration. It includes products that cleanse, moisturize, and rejuvenate the skin for a radiant, youthful glow.",
    packImage: "/images/packs/infinite-pack.jpg",
    benefits: [
      {
        benefit: "Reduces the appearance of fine lines and wrinkles",
        icon: "fa-smile-wink",
      },
      {
        benefit:
          "Provides long-lasting hydration, leaving the skin smooth and supple",
        icon: "fa-tint",
      },
      {
        benefit:
          "Promotes a more even skin tone for a radiant, youthful complexion",
        icon: "fa-sun",
      },
      {
        benefit:
          "Nourishes the skin with Aloe Vera and other premium ingredients",
        icon: "fa-leaf",
      },
      {
        benefit:
          "Protects the skin from environmental stressors and free radicals",
        icon: "fa-shield-alt",
      },
    ],
    productIds: ["676d1c6ecbf25e81ef5356c5", "676d1c6ecbf25e81ef5356be"],
  },
  {
    name: "Sonya Skin Care Pack",
    slug: "sonya",
    description:
      "A refreshing skincare pack that rejuvenates and nourishes your skin.",
    detailedDescription:
      "The Sonya Skin Care Pack is a refreshing, Aloe Vera-based skincare regimen that promotes healthy, youthful-looking skin. This pack provides deep hydration, soothing properties, and nourishment to the skin. The gentle formula is ideal for all skin types, helping to reduce signs of aging, improve skin elasticity, and provide a natural glow. With its lightweight and non-greasy texture, the Sonya Skin Care Pack revitalizes the skin, leaving it smooth and refreshed.",
    packImage: "/images/packs/sonya-pack.jpg", // Example image path
    benefits: [
      {
        benefit: "Hydrates and nourishes the skin for a smooth, soft feel",
        icon: "fa-water",
      },
      {
        benefit: "Reduces the appearance of fine lines and wrinkles",
        icon: "fa-clock",
      },
      {
        benefit:
          "Improves skin elasticity for a firmer, more youthful appearance",
        icon: "fa-random",
      },
      {
        benefit:
          "Soothes and calms irritated skin, providing relief from dryness",
        icon: "fa-spa",
      },
      {
        benefit: "Promotes a natural, healthy glow for a radiant complexion",
        icon: "fa-sun",
      },
    ],
    productIds: [
      "676d1c6ecbf25e81ef535712",
      "676d1c6ecbf25e81ef53570b",
      "676d1c6ecbf25e81ef535704",
      "676d1c6ecbf25e81ef5356fd",
    ],
  },
  {
    name: "Personal Care Pack",
    slug: "personal-care-pack",
    description: "A complete pack for daily personal care and well-being.",
    detailedDescription:
      "The Personal Care Pack includes a range of products that promote daily hygiene, freshness, and overall personal well-being. This pack contains items designed to cleanse, hydrate, and protect your skin while maintaining freshness throughout the day. Ideal for daily use, it helps you feel confident, rejuvenated, and refreshed. Whether it’s for skincare, haircare, or oral hygiene, the Personal Care Pack has everything you need to stay clean and healthy.",
    packImage: "/images/packs/personal-care-pack.jpeg", // Example image path
    benefits: [
      {
        benefit: "Cleanses and refreshes the skin, leaving it soft and smooth",
        icon: "fa-bath",
      },
      {
        benefit: "Hydrates and nourishes for healthy, glowing skin",
        icon: "fa-tint",
      },
      {
        benefit:
          "Helps maintain oral hygiene for fresh breath and healthy gums",
        icon: "fa-tooth",
      },
      {
        benefit: "Supports hair health with gentle cleansing and nourishment",
        icon: "fa-users",
      },
      {
        benefit: "Keeps you feeling fresh and confident all day",
        icon: "fa-smile",
      },
    ],
    productIds: [
      "676d1c6ecbf25e81ef535663",
      "676d1c6ecbf25e81ef53566a",
      "676d1c6ecbf25e81ef5356d3",
    ],
  },
];

// Insert packs into the database
async function insertPacks() {
  try {
    await Pack.insertMany(packs);
    console.log("Packs added successfully!");
    mongoose.disconnect();
  } catch (err) {
    console.error("Error inserting packs:", err.message);
    mongoose.disconnect();
  }
}

// Run the insertion function
insertPacks();
