const mongoose = require("mongoose");
const { Product } = require("./models/product");
const { Pack } = require("./models/pack");

const dbUri = "mongodb://localhost:27017/forever";

mongoose
  .connect(dbUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

async function seedPacks() {
  try {
    // Define pack configurations
    const packs = [
      {
        name: "C9 Pack",
        slug: "c9-pack",
        description: "Kickstart your journey to a healthier you.",
        detailedDescription: `
          The C9 Pack is designed to cleanse your body and reset your habits.
          With essential nutrients and a structured plan, this pack helps you
          achieve your health goals effectively.
        `,
        benefits: [
          "Cleanses the body",
          "Supports weight management",
          "Boosts energy",
        ],
        productIds: [
          "674d890305eecfc5394e20e6", // Replace with actual ObjectIds from your database
          "63817d4c8c45a3b2d1a6e034",
        ],
      },
      {
        name: "Sonya Pack",
        slug: "sonya-pack",
        description: "A revolutionary skincare system for radiant skin.",
        detailedDescription: `
          The Sonya Pack combines advanced skincare products to provide deep
          hydration, improved elasticity, and a youthful glow.
        `,
        benefits: [
          "Deep hydration",
          "Improved elasticity",
          "Youthful radiance",
        ],
        productIds: ["63817d4c8c45a3b2d1a6e035", "63817d4c8c45a3b2d1a6e036"],
      },
      {
        name: "Infinite Pack",
        slug: "infinite-pack",
        description:
          "Combat aging and keep your skin healthy with the Infinite Pack.",
        detailedDescription: `
          The Infinite Pack is an advanced skincare system designed to
          rejuvenate your skin. This pack helps reduce fine lines and wrinkles,
          leaving you with healthy, radiant skin.
        `,
        benefits: [
          "Reduces fine lines and wrinkles",
          "Promotes skin elasticity",
          "Boosts skin hydration",
        ],
        productIds: [
          "63817d4c8c45a3b2d1a6e037", // Replace with actual ObjectIds for Infinite Pack products
          "63817d4c8c45a3b2d1a6e038",
        ],
      },
    ];

    // Seed the packs
    await Pack.deleteMany({});
    await Pack.insertMany(packs);
    console.log("Packs seeded successfully.");
  } catch (error) {
    console.error("Error seeding packs:", error);
  } finally {
    mongoose.disconnect();
    console.log("Database connection closed.");
  }
}

// Run the seeding function
seedPacks();
