require("dotenv").config();
const mongoose = require("mongoose");
const { Product } = require("./models/product"); // Adjust path as needed

// Database connection
const DATABASE_URL =
  process.env.MONGODB_URI || "mongodb://localhost/forever-kenya";

async function seedDatabase() {
  await mongoose.connect(DATABASE_URL);

  console.log("Connected to MongoDB.");

  // Sample products
  const products = [
    {
      image: "/images/products/aloe-vera-gel.jpg",
      name: "Aloe Vera Gel",
      description:
        "Aloe Vera Gel is a refreshing drink made from pure aloe vera pulp, offering a natural way to maintain your health and vitality. This nutrient-rich beverage is packed with essential vitamins, minerals, and antioxidants that support overall wellness. It is a great companion for promoting digestion, boosting immunity, and ensuring hydration. Aloe Vera Gel is perfect for those looking to incorporate a natural product into their daily health routine.\n\nThis product is carefully extracted to preserve its natural benefits, providing you with the purest form of aloe vera. Its versatility makes it suitable for various dietary needs and preferences. From aiding digestive health to improving skin condition, Aloe Vera Gel is a must-have for anyone seeking a balanced and healthy lifestyle.",
      rating: { stars: 3, count: 120 },
      priceCents: 395600,
      usage: "Drink 30ml daily to support digestive health.",
      benefits: [
        { icon: "fa-solid fa-leaf", text: "Supports digestion and gut health" },
        { icon: "fa-solid fa-water", text: "Promotes hydration and wellness" },
      ],
      gallery: [],
      categorySlug: "drinks",
      keywords: ["aloe", "gel", "health", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/aloe-berry-nectar.jpg",
      name: "Aloe Berry Nectar",
      description:
        "Aloe Berry Nectar is a delicious blend of aloe vera gel with natural cranberry and apple flavors. This refreshing drink combines the health benefits of aloe vera with the antioxidant properties of cranberries. It is an ideal choice for maintaining a healthy urinary system while providing your body with a rich source of vitamins and phytonutrients.\n\nEnjoy the taste and wellness benefits of this nutrient-packed drink. Aloe Berry Nectar is perfect for those seeking a flavorful way to stay hydrated and maintain their daily health. Its fruity twist makes it a favorite among adults and kids alike.",
      rating: { stars: 4.5, count: 110 },
      priceCents: 395600,
      usage: "Take 30ml daily for refreshing hydration and immune support.",
      benefits: [
        {
          icon: "fa-solid fa-apple-alt",
          text: "Rich in antioxidants and phytonutrients",
        },
        {
          icon: "fa-solid fa-blender",
          text: "Supports urinary and digestive health",
        },
      ],
      gallery: [],
      categorySlug: "drinks",
      keywords: ["aloe", "berry", "juice", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/forever-freedom.jpg",
      name: "Forever Freedom",
      description:
        "Forever Freedom is a unique blend of aloe vera gel, glucosamine, chondroitin, and MSM designed to promote joint health and flexibility. This formula is perfect for those looking to maintain an active lifestyle while supporting joint function. The natural aloe vera base ensures maximum absorption and provides additional health benefits.\n\nThis drink is specially formulated for athletes, the elderly, or anyone who wants to stay mobile and comfortable. Packed with essential nutrients, Forever Freedom is the ultimate drink for healthy joints and an active life.",
      rating: { stars: 5, count: 130 },
      priceCents: 577700,
      usage: "Take one serving daily to promote joint health and flexibility.",
      benefits: [
        {
          icon: "fa-solid fa-running",
          text: "Promotes joint flexibility and comfort",
        },
        {
          icon: "fa-solid fa-bone",
          text: "Supports cartilage repair and health",
        },
      ],
      gallery: [],
      categorySlug: "drinks",
      keywords: ["freedom", "joint health", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/fields-of-greens.jpg",
      name: "Fields of Greens",
      description:
        "Fields of Greens is a powerful supplement that brings the benefits of green vegetables to your daily routine. It combines barley grass, wheatgrass, and alfalfa with cayenne pepper and honey to create a superfood packed with nutrients. This product is perfect for those who struggle to consume enough vegetables in their diet.\n\nBoost your energy levels and support your body with essential vitamins and minerals. Fields of Greens is a great way to ensure your body gets the nutrition it needs for optimal health and performance.",
      rating: { stars: 4, count: 65 },
      priceCents: 197600,
      usage: "Consume one tablet daily to support overall nutrition.",
      benefits: [
        {
          icon: "fa-solid fa-seedling",
          text: "Packed with essential greens and nutrients",
        },
        { icon: "fa-solid fa-bolt", text: "Boosts energy and vitality" },
      ],
      gallery: [],
      categorySlug: "nutrition-supplement",
      keywords: ["greens", "health", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/forever-calcium.jpg",
      name: "Forever Calcium",
      description:
        "Forever Calcium provides your body with the calcium it needs to support bone health and strength. Formulated with an advanced blend of calcium citrate and vitamin D, this supplement ensures maximum absorption and benefits. Ideal for people of all ages, it helps maintain healthy bones and teeth while reducing the risk of osteoporosis.\n\nWith Forever Calcium, you can feel confident about your bone health. It’s the perfect addition to your daily supplement routine for long-term wellness.",
      rating: { stars: 5, count: 120 },
      priceCents: 376400,
      usage: "Take two tablets daily to maintain bone strength.",
      benefits: [
        { icon: "fa-solid fa-bone", text: "Strengthens bones and teeth" },
        {
          icon: "fa-solid fa-sun",
          text: "Enhances calcium absorption with vitamin D",
        },
      ],
      gallery: [],
      categorySlug: "nutrition-supplement",
      keywords: ["calcium", "bones", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/garlic-thyme.jpg",
      name: "Garlic Thyme",
      description:
        "Garlic Thyme combines the power of garlic and thyme to create a potent supplement for immune health and cardiovascular support. This product offers the natural benefits of these herbs in a convenient capsule form. Garlic has long been known for its heart-healthy properties, while thyme is packed with antioxidants.\n\nTogether, they create a dynamic duo that supports your body's natural defenses and promotes overall well-being. Garlic Thyme is an excellent choice for anyone looking to enhance their immune and cardiovascular health naturally.",
      rating: { stars: 4.5, count: 60 },
      priceCents: 268800,
      usage: "Take one capsule twice daily to support immune health.",
      benefits: [
        {
          icon: "fa-solid fa-heart",
          text: "Promotes heart and cardiovascular health",
        },
        {
          icon: "fa-solid fa-shield-alt",
          text: "Supports a healthy immune system",
        },
      ],
      gallery: [],
      categorySlug: "nutrition-supplement",
      keywords: [
        "garlic",
        "thyme",
        "immune support",
        "Kenya",
        "forever living",
      ],
      isOnOffer: false,
    },
    {
      image: "/images/products/royal-jelly.jpg",
      name: "Royal Jelly",
      description:
        "Royal Jelly is a natural source of vitamins and minerals that promote energy and overall wellness. Harvested from the hives of bees, this supplement is rich in essential nutrients like B-vitamins and amino acids. It is a great choice for anyone looking to boost their vitality and maintain their health.\n\nThis unique product is perfect for busy individuals and those seeking natural energy support. With Royal Jelly, you can enjoy the benefits of one of nature's most remarkable gifts.",
      rating: { stars: 3, count: 85 },
      priceCents: 499200,
      usage: "Take one teaspoon daily for natural energy support.",
      benefits: [
        { icon: "fa-solid fa-leaf", text: "Rich in vitamins and minerals" },
        { icon: "fa-solid fa-bolt", text: "Boosts energy and vitality" },
      ],
      gallery: [],
      categorySlug: "nutrition-supplement",
      keywords: ["royal jelly", "energy", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/arctic-sea.jpg",
      name: "Arctic Sea",
      description:
        "Arctic Sea is a premium blend of omega-3 fatty acids sourced from fish oil and olive oil. This supplement is designed to support heart, brain, and joint health. With a perfect balance of EPA and DHA, Arctic Sea delivers the essential nutrients your body needs for optimal function.\n\nWhether you're looking to support your cardiovascular health or enhance your brain performance, Arctic Sea is an excellent choice. It’s a natural way to maintain a healthy and active lifestyle.",
      rating: { stars: 3.5, count: 115 },
      priceCents: 460800,
      usage: "Consume two capsules daily for omega-3 benefits.",
      benefits: [
        {
          icon: "fa-solid fa-brain",
          text: "Supports brain and cognitive function",
        },
        { icon: "fa-solid fa-heart", text: "Promotes cardiovascular health" },
      ],
      gallery: [],
      categorySlug: "nutrition-supplement",
      keywords: ["arctic sea", "omega", "health", "Kenya", "forever living"],
      isOnOffer: false,
    },

    {
      image: "/images/products/vitolize-men.jpg",
      name: "Vitolize for Men",
      description:
        "Vitolize for Men is a specially formulated supplement designed to support men’s overall health. This product combines vitamins, minerals, and herbal extracts to promote prostate health, hormonal balance, and energy levels. It is an excellent choice for men looking to maintain vitality and well-being.\n\nWith its blend of natural ingredients, Vitolize for Men provides essential support for active lifestyles. Whether you're at work or the gym, this supplement helps you stay at your best throughout the day.",
      rating: { stars: 3.5, count: 95 },
      priceCents: 460800,
      usage: "Take two capsules daily for optimal male health.",
      benefits: [
        {
          icon: "fa-solid fa-mars",
          text: "Supports prostate and hormonal health",
        },
        { icon: "fa-solid fa-bolt", text: "Boosts energy and vitality" },
      ],
      gallery: [],
      categorySlug: "nutrition-supplement",
      keywords: ["vitolize", "men", "health", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/vitolize-women.jpg",
      name: "Vitolize for Women",
      description:
        "Vitolize for Women is a comprehensive supplement designed to support women's health. It combines vitamins, minerals, and botanical extracts to help balance hormones, boost energy, and support overall well-being. This product is ideal for women seeking a natural way to maintain their health and vitality.\n\nWith Vitolize for Women, you can enjoy the confidence that comes with a well-balanced and healthy lifestyle. It’s perfect for women of all ages who want to feel their best every day.",
      rating: { stars: 5, count: 90 },
      priceCents: 487800,
      usage: "Take two capsules daily for hormonal balance and energy.",
      benefits: [
        {
          icon: "fa-solid fa-venus",
          text: "Balances hormones and supports well-being",
        },
        { icon: "fa-solid fa-bolt", text: "Enhances energy and vitality" },
      ],
      gallery: [],
      categorySlug: "nutrition-supplement",
      keywords: ["vitolize", "women", "health", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/forever-therm.jpg",
      name: "Forever Therm",
      description:
        "Forever Therm is a powerful thermogenic supplement designed to support your weight management goals. Packed with natural ingredients like green tea, guarana, and caffeine, it helps boost metabolism and energy levels. This product is perfect for anyone looking to enhance their fitness routine or shed unwanted pounds.\n\nForever Therm not only supports weight loss but also provides sustained energy to keep you active and focused throughout the day. It's a great addition to a healthy diet and exercise program.",
      rating: { stars: 4, count: 75 },
      priceCents: 437900,
      usage: "Take one tablet twice daily to support weight management.",
      benefits: [
        {
          icon: "fa-solid fa-fire",
          text: "Boosts metabolism and energy levels",
        },
        {
          icon: "fa-solid fa-weight",
          text: "Supports weight management goals",
        },
      ],
      gallery: [],
      categorySlug: "nutrition-supplement",
      keywords: ["therm", "weight management", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/absorbent-c.jpg",
      name: "Absorbent-C",
      description:
        "Absorbent-C provides your body with a vital boost of vitamin C to support immune health and overall wellness. This unique supplement combines vitamin C with oat bran, enhancing its absorption and effectiveness. It's a great way to ensure your daily intake of this essential nutrient.\n\nWhether you're looking to strengthen your immune system or maintain healthy skin, Absorbent-C is a convenient and natural way to meet your nutritional needs.",
      rating: { stars: 5, count: 50 },
      priceCents: 265100,
      usage: "Take one tablet daily to support immune health.",
      benefits: [
        {
          icon: "fa-solid fa-shield-virus",
          text: "Strengthens the immune system",
        },
        {
          icon: "fa-solid fa-sun",
          text: "Supports skin health and collagen production",
        },
      ],
      gallery: [],
      categorySlug: "nutrition-supplement",
      keywords: ["vitamin C", "absorbent", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/aloe-lips.jpg",
      name: "Aloe Lips",
      description:
        "Aloe Lips is a moisturizing lip balm infused with aloe vera, jojoba oil, and beeswax. This convenient product provides hydration and protection for your lips, keeping them soft and smooth in any weather. Its soothing formula is perfect for preventing and treating dry or chapped lips.\n\nCompact and easy to carry, Aloe Lips is a must-have for your daily skincare routine. It’s ideal for anyone looking for a natural and effective lip care solution.",
      rating: { stars: 3.5, count: 70 },
      priceCents: 53800,
      usage: "Apply as needed to moisturize and protect lips.",
      benefits: [
        { icon: "fa-solid fa-tint", text: "Deeply hydrates and softens lips" },
        {
          icon: "fa-solid fa-wind",
          text: "Protects against dryness and chapping",
        },
      ],
      gallery: [],
      categorySlug: "personal-care",
      keywords: ["aloe", "lip balm", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/forever-bright-toothgel.jpg",
      name: "Forever Bright Toothgel",
      description:
        "Forever Bright Toothgel is a premium toothpaste made with aloe vera and bee propolis to promote oral health and hygiene. This fluoride-free formula is gentle on your gums while effectively cleaning your teeth and freshening your breath. It's suitable for the whole family and ideal for those with sensitive gums.\n\nExperience the natural benefits of aloe vera in your daily oral care routine. Forever Bright Toothgel is a perfect choice for maintaining a bright and healthy smile.",
      rating: { stars: 3.5, count: 85 },
      priceCents: 130900,
      usage: "Brush twice daily for a clean and healthy smile.",
      benefits: [
        { icon: "fa-solid fa-tooth", text: "Promotes gum and oral health" },
        {
          icon: "fa-solid fa-smile",
          text: "Freshens breath and whitens teeth",
        },
      ],
      gallery: [],
      categorySlug: "personal-care",
      keywords: ["toothgel", "aloe", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/forever-supergreens.jpg",
      name: "Forever Supergreens",
      description:
        "Forever Supergreens is a nutrient-rich blend of over 20 fruits, vegetables, and superfoods designed to provide your body with essential nutrients. This powerful formula supports energy, immunity, and digestive health while alkalizing your body for optimal performance.\n\nConvenient and easy to mix, Forever Supergreens is perfect for busy individuals looking to maintain a healthy and balanced lifestyle. It's an excellent way to fuel your body with the goodness it needs every day.",
      rating: { stars: 3, count: 75 },
      priceCents: 539400,
      usage: "Mix one scoop with water or juice daily for a nutrient boost.",
      benefits: [
        {
          icon: "fa-solid fa-apple-whole",
          text: "Packed with essential nutrients and superfoods",
        },
        { icon: "fa-solid fa-bolt", text: "Boosts energy and immunity" },
      ],
      gallery: [],
      categorySlug: "nutrition-supplement",
      keywords: ["greens", "immune", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/aloe-mpd.jpg",
      name: "Aloe MPD",
      description:
        "Aloe MPD is a multi-purpose cleaner that combines the natural power of aloe vera with an eco-friendly formula. This versatile product can be used for laundry, dishes, and general cleaning tasks, making it a convenient and effective solution for all your household needs.\n\nGentle on hands yet tough on stains, Aloe MPD is perfect for those seeking a natural and biodegradable alternative to harsh chemical cleaners. It’s safe for the environment and your family.",
      rating: { stars: 3, count: 85 },
      priceCents: 346700,
      usage: "Dilute as needed for cleaning laundry, dishes, or surfaces.",
      benefits: [
        { icon: "fa-solid fa-soap", text: "Gentle on hands, tough on stains" },
        {
          icon: "fa-solid fa-leaf",
          text: "Eco-friendly and biodegradable formula",
        },
      ],
      gallery: [],
      categorySlug: "personal-care",
      keywords: ["mpd", "cleaner", "Kenya", "forever living"],
      isOnOffer: false,
    },

    {
      image: "/images/products/forever-daily.jpg",
      name: "Forever Daily",
      description:
        "Forever Daily is a carefully crafted multivitamin designed to support your overall health and well-being. Packed with over 55 nutrients, including essential vitamins and minerals, this supplement provides your body with the nutrition it needs to function at its best. With AOS Complex, it enhances nutrient absorption for maximum benefits.\n\nPerfect for those with busy lifestyles, Forever Daily ensures you meet your daily nutritional requirements. It’s the ideal choice for maintaining energy, immunity, and overall vitality.",
      rating: { stars: 4.5, count: 95 },
      priceCents: 307300,
      usage: "Take two tablets daily for complete nutritional support.",
      benefits: [
        {
          icon: "fa-solid fa-pills",
          text: "Provides essential vitamins and minerals",
        },
        { icon: "fa-solid fa-bolt", text: "Boosts energy and immunity" },
      ],
      gallery: [],
      categorySlug: "nutrition-supplement",
      keywords: ["daily", "multivitamin", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/aloe-scrub.jpg",
      name: "Aloe Scrub",
      description:
        "Aloe Scrub is a gentle exfoliating product made with natural jojoba beads and aloe vera. This scrub effectively removes dead skin cells, leaving your skin smooth, soft, and refreshed. It is gentle enough for daily use and suitable for all skin types.\n\nWhether you want to achieve a glowing complexion or maintain healthy skin, Aloe Scrub is your go-to product. Its soothing and hydrating formula ensures your skin looks and feels its best.",
      rating: { stars: 3, count: 95 },
      priceCents: 243700,
      usage: "Apply to damp skin, massage gently, and rinse thoroughly.",
      benefits: [
        {
          icon: "fa-solid fa-leaf",
          text: "Infused with aloe vera for hydration",
        },
        {
          icon: "fa-solid fa-seedling",
          text: "Exfoliates and renews skin gently",
        },
      ],
      gallery: [],
      categorySlug: "personal-care",
      keywords: ["scrub", "skin care", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/sonya-skin-care.jpg",
      name: "Sonya Daily Skin Care System",
      description:
        "Sonya Daily Skin Care System is an advanced skincare collection designed to hydrate and rejuvenate your skin. Featuring aloe vera, botanicals, and fruit extracts, this system offers a complete solution for cleansing, moisturizing, and balancing your skin.\n\nThis set is perfect for those who want radiant and youthful-looking skin. It’s ideal for all skin types and provides long-lasting hydration to keep your skin healthy and glowing.",
      rating: { stars: 4, count: 50 },
      priceCents: 1309600,
      usage: "Use the cleanser, moisturizer, and serum as directed daily.",
      benefits: [
        { icon: "fa-solid fa-gem", text: "Nourishes and rejuvenates the skin" },
        { icon: "fa-solid fa-water", text: "Provides long-lasting hydration" },
      ],
      gallery: [],
      categorySlug: "personal-care",
      keywords: ["skin care", "sonya", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/forever-argiplus.jpg",
      name: "Forever Argi+ Stick Packs",
      description:
        "Forever Argi+ Stick Packs are a convenient way to enjoy the benefits of L-Arginine. This supplement supports heart health, blood circulation, and energy production. Enhanced with vitamins and fruit extracts, it delivers a refreshing boost for your daily routine.\n\nPerfect for athletes or anyone looking to enhance their physical performance, Argi+ is an excellent addition to your healthy lifestyle. Its on-the-go packaging makes it easy to use anytime, anywhere.",
      rating: { stars: 4.5, count: 100 },
      priceCents: 1163600,
      usage: "Mix one stick pack with water daily for a heart-healthy boost.",
      benefits: [
        { icon: "fa-solid fa-heart", text: "Supports cardiovascular health" },
        { icon: "fa-solid fa-running", text: "Boosts energy and stamina" },
      ],
      gallery: [],
      categorySlug: "nutrition-supplement",
      keywords: ["argi", "energy", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/aloe-jojoba-shampoo.jpg",
      name: "Aloe Jojoba Shampoo",
      description:
        "Aloe Jojoba Shampoo is a nourishing shampoo enriched with aloe vera and jojoba oil. It gently cleanses your hair while moisturizing and strengthening each strand. This shampoo is perfect for all hair types, leaving your hair feeling soft, smooth, and manageable.\n\nWith its natural formula, Aloe Jojoba Shampoo is free from harmful chemicals, making it safe for everyday use. Experience the natural way to healthy, beautiful hair.",
      rating: { stars: 5, count: 75 },
      priceCents: 333900,
      usage:
        "Apply to wet hair, lather, and rinse thoroughly. Repeat if needed.",
      benefits: [
        { icon: "fa-solid fa-leaf", text: "Nourishes and strengthens hair" },
        { icon: "fa-solid fa-water", text: "Gently cleanses and moisturizes" },
      ],
      gallery: [],
      categorySlug: "personal-care",
      keywords: ["shampoo", "jojoba", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/forever-move.jpg",
      name: "Forever Move",
      description:
        "Forever Move is a powerful supplement designed to support joint health and mobility. Featuring a blend of natural ingredients like turmeric and eggshell membrane, this product helps reduce inflammation and promote flexibility. It’s perfect for active individuals and those with joint discomfort.\n\nWith Forever Move, you can stay active and enjoy the freedom of movement. It’s a great addition to your daily routine for long-term joint health.",
      rating: { stars: 5, count: 90 },
      priceCents: 958500,
      usage: "Take three capsules daily to support joint mobility.",
      benefits: [
        {
          icon: "fa-solid fa-running",
          text: "Enhances joint flexibility and mobility",
        },
        {
          icon: "fa-solid fa-hand-holding-heart",
          text: "Supports healthy cartilage and joints",
        },
      ],
      gallery: [],
      categorySlug: "nutrition-supplement",
      keywords: ["move", "joint support", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/aloe-heat-lotion.jpg",
      name: "Aloe Heat Lotion",
      description:
        "Aloe Heat Lotion is a soothing massage lotion infused with aloe vera, menthol, and eucalyptus oil. This lotion provides a warming sensation that helps relax muscles and relieve tension. It’s ideal for use after workouts or a long day.\n\nPerfect for anyone looking for natural relief, Aloe Heat Lotion is a great addition to your wellness routine. It’s gentle on the skin while providing effective relief.",
      rating: { stars: 5, count: 90 },
      priceCents: 206600,
      usage:
        "Apply to the affected area and massage gently for soothing relief.",
      benefits: [
        {
          icon: "fa-solid fa-fire",
          text: "Provides a warming sensation for sore muscles",
        },
        { icon: "fa-solid fa-leaf", text: "Infused with natural aloe vera" },
      ],
      gallery: [],
      categorySlug: "personal-care",
      keywords: ["heat lotion", "relief", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/forever-lean.jpg",
      name: "Forever Lean",
      description:
        "Forever Lean is a weight management supplement that combines natural ingredients like chromium, cactus extract, and white kidney bean extract. This product helps block the absorption of calories from fats and carbohydrates, making it an excellent choice for those pursuing a healthy weight.\n\nWith Forever Lean, you can take control of your weight and maintain a balanced diet. It’s a great addition to a healthy lifestyle for effective weight management.",
      rating: { stars: 4, count: 80 },
      priceCents: 641200,
      usage: "Take two capsules with water before meals for best results.",
      benefits: [
        { icon: "fa-solid fa-weight", text: "Supports weight management" },
        {
          icon: "fa-solid fa-apple-alt",
          text: "Reduces calorie absorption from fats and carbs",
        },
      ],
      gallery: [],
      categorySlug: "nutrition-supplement",
      keywords: ["lean", "weight loss", "Kenya", "forever living"],
      isOnOffer: false,
    },

    {
      image: "/images/products/infinite-skin-care-kit.jpg",
      name: "Infinite Skin Care Kit",
      description:
        "The Infinite Skin Care Kit is a premium collection of skincare products designed to reduce signs of aging and promote youthful, glowing skin. This advanced system includes a cleanser, serum, and moisturizer, all enriched with aloe vera, peptides, and natural botanicals. It hydrates deeply while improving elasticity and firmness.\n\nPerfect for all skin types, this kit offers a comprehensive approach to skincare. With consistent use, your skin will look refreshed, radiant, and revitalized.",
      rating: { stars: 3.5, count: 60 },
      priceCents: 2603500,
      usage: "Follow the step-by-step routine daily for maximum results.",
      benefits: [
        {
          icon: "fa-solid fa-gem",
          text: "Reduces signs of aging and promotes elasticity",
        },
        {
          icon: "fa-solid fa-water",
          text: "Provides deep hydration and nourishment",
        },
      ],
      gallery: [],
      categorySlug: "skin-care",
      keywords: ["infinite", "skin care", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/infinite-hydrating-cleanser.jpg",
      name: "Infinite Hydrating Cleanser",
      description:
        "The Infinite Hydrating Cleanser gently removes impurities while nourishing and hydrating your skin. Formulated with aloe vera, coconut oil, and apple extract, this cleanser is perfect for maintaining a clean, fresh complexion.\n\nIts hydrating formula ensures your skin feels soft and smooth after every wash. Ideal for daily use, it is suitable for all skin types.",
      rating: { stars: 4.5, count: 40 },
      priceCents: 453000,
      usage: "Use daily to cleanse and hydrate your skin.",
      benefits: [
        {
          icon: "fa-solid fa-water",
          text: "Cleanses while hydrating the skin",
        },
        {
          icon: "fa-solid fa-apple-alt",
          text: "Infused with natural extracts for nourishment",
        },
      ],
      gallery: [],
      categorySlug: "skin-care",
      keywords: ["cleanser", "hydrating", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/infinite-firming-serum.jpg",
      name: "Infinite Firming Serum",
      description:
        "Infinite Firming Serum is a cutting-edge anti-aging serum designed to enhance skin elasticity and reduce the appearance of fine lines and wrinkles. Enriched with aloe vera, tripeptides, and hyaluronic acid, this serum helps you achieve a youthful and radiant complexion.\n\nPerfect for all skin types, this serum offers visible results with consistent use. It’s a must-have for those seeking advanced skincare solutions.",
      rating: { stars: 3.5, count: 30 },
      priceCents: 721800,
      usage: "Apply to cleansed skin daily to reduce signs of aging.",
      benefits: [
        {
          icon: "fa-solid fa-gem",
          text: "Enhances skin elasticity and firmness",
        },
        { icon: "fa-solid fa-water", text: "Hydrates and reduces fine lines" },
      ],
      gallery: [],
      categorySlug: "skin-care",
      keywords: ["serum", "firming", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/c9-pack.jpg",
      name: "C9 Pack Aminotein",
      description:
        "The C9 Pack Aminotein is a comprehensive 9-day cleansing and weight management program designed to kickstart your journey to a healthier lifestyle. This pack includes carefully formulated supplements and meal replacement shakes that help detoxify your body, support digestion, and promote weight loss.\n\nWhether you're looking to shed a few pounds or reset your health, the C9 Pack is a great starting point. It’s an easy-to-follow program for achieving your wellness goals.",
      rating: { stars: 4.5, count: 50 },
      priceCents: 1851200,
      usage: "Follow the 9-day program guide for best results.",
      benefits: [
        {
          icon: "fa-solid fa-recycle",
          text: "Promotes detoxification and digestion",
        },
        {
          icon: "fa-solid fa-weight",
          text: "Supports weight management and energy",
        },
      ],
      gallery: [],
      categorySlug: "nutrition-supplement",
      keywords: ["c9", "detox", "vanilla", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/aloe-vera-gelly.jpg",
      name: "Aloe Vera Gelly (Tube)",
      description:
        "Aloe Vera Gelly is a soothing gel made with 100% stabilized aloe vera. This versatile product is perfect for hydrating, cooling, and soothing the skin. It’s an excellent choice for minor cuts, burns, and skin irritations.\n\nIdeal for all skin types, Aloe Vera Gelly is your go-to solution for instant relief and hydration. Its lightweight formula is easily absorbed, leaving your skin feeling fresh and comfortable.",
      rating: { stars: 4, count: 80 },
      priceCents: 226500,
      usage: "Apply generously to the affected area for instant relief.",
      benefits: [
        {
          icon: "fa-solid fa-leaf",
          text: "Soothes and hydrates the skin naturally",
        },
        {
          icon: "fa-solid fa-bolt",
          text: "Provides quick relief from irritations",
        },
      ],
      gallery: [],
      categorySlug: "skin-care",
      keywords: ["gelly", "skin care", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/aloe-moisturizing-lotion.jpg",
      name: "Aloe Moisturizing Lotion (Tube)",
      description:
        "Aloe Moisturizing Lotion is a rich moisturizer designed to hydrate and nourish your skin. Infused with aloe vera, collagen, and elastin, this lotion restores your skin's natural softness and elasticity. It’s perfect for dry or sensitive skin.\n\nWhether you're battling dry weather or need a daily hydration boost, Aloe Moisturizing Lotion is your ideal companion. It’s gentle, non-greasy, and leaves your skin feeling smooth and rejuvenated.",
      rating: { stars: 3.5, count: 60 },
      priceCents: 226500,
      usage: "Apply daily to clean skin for hydration and nourishment.",
      benefits: [
        { icon: "fa-solid fa-leaf", text: "Hydrates and softens the skin" },
        {
          icon: "fa-solid fa-hand-sparkles",
          text: "Improves skin texture and elasticity",
        },
      ],
      gallery: [],
      categorySlug: "skin-care",
      keywords: ["moisturizing", "aloe", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/aloe-jojoba-conditioner.jpg",
      name: "Aloe Jojoba Conditioning Rinse",
      description:
        "Aloe Jojoba Conditioning Rinse is a luxurious conditioner that detangles, nourishes, and strengthens your hair. Infused with aloe vera and jojoba oil, this product leaves your hair soft, shiny, and manageable. It’s ideal for daily use on all hair types.\n\nFor those who want naturally beautiful hair, this conditioner is the perfect complement to Aloe Jojoba Shampoo. It’s free from harsh chemicals and safe for the whole family.",
      rating: { stars: 3.5, count: 80 },
      priceCents: 356700,
      usage:
        "Apply after shampooing, leave for 2 minutes, and rinse thoroughly.",
      benefits: [
        { icon: "fa-solid fa-leaf", text: "Nourishes and strengthens hair" },
        { icon: "fa-solid fa-water", text: "Adds shine and manageability" },
      ],
      gallery: [],
      categorySlug: "personal-care",
      keywords: ["jojoba", "conditioner", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/forever-active-probiotic.jpg",
      name: "Forever Active Probiotic",
      description:
        "Forever Active Probiotic is a natural supplement designed to support digestive health. Featuring six beneficial strains of probiotics, this product helps maintain a healthy balance of gut bacteria. Its unique beadlet technology ensures the probiotics reach your intestines alive for maximum effectiveness.\n\nThis supplement is perfect for those looking to improve digestion, boost immunity, and maintain overall gut health. It’s an easy and convenient way to keep your digestive system functioning optimally.",
      rating: { stars: 5, count: 75 },
      priceCents: 564600,
      usage: "Take one beadlet daily to support digestive health.",
      benefits: [
        {
          icon: "fa-solid fa-stomach",
          text: "Supports a healthy gut microbiome",
        },
        {
          icon: "fa-solid fa-shield-alt",
          text: "Boosts immune system functionality",
        },
      ],
      gallery: [],
      categorySlug: "nutrition-supplement",
      keywords: ["probiotic", "gut health", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/forever-kids.jpg",
      name: "Forever Kids Chewable Multivitamin",
      description:
        "Forever Kids Chewable Multivitamin is a fun and delicious way for children to get their daily nutrients. Packed with essential vitamins and minerals, this supplement supports growth, development, and overall health. Its natural flavors make it a hit with kids.\n\nIdeal for picky eaters, Forever Kids ensures your little ones get the nutrition they need to thrive. It’s a parent-approved solution for healthy, happy kids.",
      rating: { stars: 5, count: 100 },
      priceCents: 230400,
      usage: "Give two chewable tablets daily for nutritional support.",
      benefits: [
        { icon: "fa-solid fa-child", text: "Supports growth and development" },
        {
          icon: "fa-solid fa-apple-alt",
          text: "Provides essential vitamins and minerals",
        },
      ],
      gallery: [],
      categorySlug: "nutrition-supplement",
      keywords: ["kids", "multivitamin", "Kenya", "forever living"],
      isOnOffer: false,
    },
    {
      image: "/images/products/awakening-eye-creme.jpg",
      name: "Awakening Eye Crème",
      description:
        "Awakening Eye Crème is a luxurious cream specially formulated to reduce puffiness, dark circles, and fine lines around the eyes. Infused with aloe vera, peptides, and botanical extracts, this product rejuvenates and brightens your delicate eye area.\n\nWhether you’re battling tired eyes or seeking a youthful glow, Awakening Eye Crème is your perfect solution. Its lightweight formula absorbs quickly, leaving your skin refreshed and radiant.",
      rating: { stars: 4.5, count: 70 },
      priceCents: 280400,
      usage: "Apply gently around the eye area daily for best results.",
      benefits: [
        { icon: "fa-solid fa-eye", text: "Reduces puffiness and dark circles" },
        {
          icon: "fa-solid fa-gem",
          text: "Smooths fine lines for a youthful look",
        },
      ],
      gallery: [],
      categorySlug: "skin-care",
      keywords: ["eye", "crème", "awakening", "Kenya"],
      isOnOffer: false,
    },

    {
      image: "/images/products/sonya-refreshing-gel-cleanser.jpg",
      name: "Sonya Refreshing Gel Cleanser",
      description:
        "Sonya Refreshing Gel Cleanser is a gentle, aloe vera-based facial cleanser designed to remove impurities while hydrating your skin. Its gel formula glides smoothly, leaving your skin feeling refreshed and clean. Enriched with botanical extracts, it’s suitable for all skin types.\n\nThis cleanser is perfect for daily use and helps to maintain a healthy and glowing complexion. Whether you're starting your day or winding down, it’s a must-have in your skincare routine.",
      rating: { stars: 5, count: 60 },
      priceCents: 361100,
      usage: "Apply to damp skin, massage gently, and rinse thoroughly.",
      benefits: [
        { icon: "fa-solid fa-water", text: "Hydrates and cleanses the skin" },
        {
          icon: "fa-solid fa-seedling",
          text: "Enriched with natural botanical extracts",
        },
      ],
      gallery: [],
      categorySlug: "skin-care",
      keywords: ["gel", "cleanser", "Kenya"],
      isOnOffer: false,
    },
    {
      image: "/images/products/sonya-illuminating-gel.jpg",
      name: "Sonya Illuminating Gel",
      description:
        "Sonya Illuminating Gel is a lightweight gel designed to brighten and even out your skin tone. Featuring aloe vera, white tea extract, and peptides, this product helps to reduce discoloration and improve skin radiance. It’s perfect for anyone looking to achieve a natural, healthy glow.\n\nWith consistent use, this gel transforms dull skin into a vibrant and luminous complexion. It’s a great addition to your skincare regimen.",
      rating: { stars: 5, count: 50 },
      priceCents: 341800,
      usage: "Apply evenly to cleansed skin daily for radiant results.",
      benefits: [
        { icon: "fa-solid fa-sun", text: "Brightens and evens skin tone" },
        { icon: "fa-solid fa-leaf", text: "Packed with nourishing botanicals" },
      ],
      gallery: [],
      categorySlug: "skin-care",
      keywords: ["illuminating", "gel", "Kenya"],
      isOnOffer: false,
    },
    {
      image: "/images/products/sonya-refining-gel-mask.jpg",
      name: "Sonya Refreshing Gel Mask",
      description:
        "Sonya Refreshing Gel Mask is a hydrating overnight mask that rejuvenates your skin while you sleep. Infused with aloe vera, chestnut seed extract, and bamboo extract, it helps to improve skin texture and elasticity. This mask provides deep hydration and a calming effect, ensuring you wake up with refreshed and glowing skin.\n\nPerfect for all skin types, this mask is a simple yet effective way to elevate your skincare routine.",
      rating: { stars: 3, count: 50 },
      priceCents: 361100,
      usage: "Apply before bed, leave on overnight, and rinse in the morning.",
      benefits: [
        { icon: "fa-solid fa-moon", text: "Rejuvenates skin overnight" },
        {
          icon: "fa-solid fa-water",
          text: "Provides deep hydration and nourishment",
        },
      ],
      gallery: [],
      categorySlug: "skin-care",
      keywords: ["refreshing", "mask", "Kenya"],
      isOnOffer: false,
    },
    {
      image: "/images/products/sonya-soothing-gel-moisturizer.jpg",
      name: "Sonya Soothing Gel Moisturizer",
      description:
        "Sonya Soothing Gel Moisturizer is a hydrating moisturizer with a unique gel-based formula. Infused with aloe vera, hyaluronic acid, and botanical extracts, it delivers intense hydration while soothing the skin. This lightweight moisturizer is perfect for daily use and leaves your skin feeling soft, smooth, and radiant.\n\nIts non-greasy formula makes it suitable for all skin types, providing a refreshing and comfortable finish.",
      rating: { stars: 4.5, count: 60 },
      priceCents: 395600,
      usage: "Apply to clean skin daily for long-lasting hydration.",
      benefits: [
        { icon: "fa-solid fa-leaf", text: "Soothes and moisturizes the skin" },
        { icon: "fa-solid fa-water", text: "Provides long-lasting hydration" },
      ],
      gallery: [],
      categorySlug: "skin-care",
      keywords: ["soothing", "moisturizer", "Kenya"],
      isOnOffer: false,
    },
    {
      image: "/images/products/aloe-activator.jpg",
      name: "Aloe Activator",
      description:
        "Aloe Activator is a versatile skincare product made from 99.9% pure aloe vera gel. It helps to cleanse, hydrate, and soothe your skin, making it a perfect addition to any skincare routine. This gentle formula can also be used as a base for face masks and other treatments.\n\nWith its soothing and cooling properties, Aloe Activator is suitable for all skin types and helps to improve skin texture and tone.",
      rating: { stars: 4.5, count: 50 },
      priceCents: 245600,
      usage: "Apply gently to the skin or mix with other skincare products.",
      benefits: [
        { icon: "fa-solid fa-leaf", text: "Hydrates and soothes the skin" },
        { icon: "fa-solid fa-seedling", text: "Versatile and easy to use" },
      ],
      gallery: [],
      categorySlug: "skin-care",
      keywords: ["aloe", "activator", "Kenya"],
      isOnOffer: false,
    },
    {
      image: "/images/products/new-sunscreen-lotion.jpg",
      name: "New Sunscreen Lotion",
      description:
        "New Sunscreen Lotion is a lightweight, broad-spectrum sunscreen enriched with aloe vera and vitamin E. It protects your skin from harmful UVA and UVB rays while keeping it hydrated and nourished. Perfect for daily use, it helps to prevent sunburn and premature aging.\n\nWhether you’re outdoors or on the go, New Sunscreen Lotion is your reliable companion for healthy, protected skin.",
      rating: { stars: 4, count: 50 },
      priceCents: 318900,
      usage: "Apply generously to exposed skin before sun exposure.",
      benefits: [
        {
          icon: "fa-solid fa-sun",
          text: "Provides broad-spectrum sun protection",
        },
        {
          icon: "fa-solid fa-leaf",
          text: "Enriched with aloe vera and vitamin E",
        },
      ],
      gallery: [],
      categorySlug: "skin-care",
      keywords: ["sunscreen", "lotion", "Kenya"],
      isOnOffer: false,
    },
    {
      image: "/images/products/hydrating-serum.jpg",
      name: "Hydrating Serum",
      description:
        "Hydrating Serum is a deeply moisturizing serum that replenishes your skin with essential hydration. Formulated with aloe vera, hyaluronic acid, and white tea extract, this serum helps to improve your skin's texture and elasticity. It’s perfect for reducing dryness and giving your skin a fresh, youthful appearance.\n\nIdeal for all skin types, Hydrating Serum provides long-lasting hydration and leaves your skin feeling soft and supple.",
      rating: { stars: 5, count: 60 },
      priceCents: 490300,
      usage: "Apply a small amount to clean skin before moisturizing.",
      benefits: [
        {
          icon: "fa-solid fa-water",
          text: "Provides deep and long-lasting hydration",
        },
        {
          icon: "fa-solid fa-gem",
          text: "Improves skin texture and elasticity",
        },
      ],
      gallery: [],
      categorySlug: "skin-care",
      keywords: ["hydrating", "serum", "Kenya"],
      isOnOffer: false,
    },
    {
      image: "/images/products/aloe-liquid-soap.jpg",
      name: "Aloe Liquid Soap (New)",
      description:
        "Aloe Liquid Soap is a gentle, moisturizing soap enriched with aloe vera. It effectively cleanses while hydrating and soothing your skin. This soap is suitable for the whole family and perfect for daily use on hands, face, and body.\n\nWith its rich lather and natural ingredients, Aloe Liquid Soap leaves your skin feeling soft, clean, and refreshed.",
      rating: { stars: 5, count: 50 },
      priceCents: 287800,
      usage: "Use as needed for cleansing hands, face, or body.",
      benefits: [
        {
          icon: "fa-solid fa-soap",
          text: "Gently cleanses without drying the skin",
        },
        {
          icon: "fa-solid fa-leaf",
          text: "Infused with aloe vera for hydration",
        },
      ],
      gallery: [],
      categorySlug: "skin-care",
      keywords: ["liquid", "soap", "Kenya"],
      isOnOffer: false,
    },
    {
      image: "/images/products/aloe-blossom-herbal-tea.jpg",
      name: "Aloe Blossom Herbal Tea",
      description:
        "Aloe Blossom Herbal Tea is a soothing blend of natural herbs and spices, including aloe vera, cinnamon, and cardamom. This caffeine-free tea is perfect for relaxing moments and supports digestion and overall wellness. Its aromatic flavor makes it a delightful choice for tea lovers.\n\nEnjoy the calming benefits of Aloe Blossom Herbal Tea any time of the day. It’s a great way to unwind and nourish your body naturally.",
      rating: { stars: 3, count: 70 },
      priceCents: 213100,
      usage: "Steep one tea bag in hot water for 3-5 minutes before drinking.",
      benefits: [
        {
          icon: "fa-solid fa-mug-hot",
          text: "Promotes relaxation and digestion",
        },
        {
          icon: "fa-solid fa-leaf",
          text: "Infused with natural herbs and spices",
        },
      ],
      gallery: [],
      categorySlug: "nutrition-supplement",
      keywords: ["herbal", "tea", "Kenya"],
      isOnOffer: false,
    },
    {
      image: "/images/products/forever-bee-pollen.jpg",
      name: "Forever Bee Pollen",
      description:
        "Forever Bee Pollen is a natural energy booster rich in essential nutrients. Sourced from the finest bee pollen, this supplement provides vitamins, minerals, enzymes, and amino acids to support overall health and vitality. It’s an excellent choice for those with active lifestyles.\n\nEnjoy the natural benefits of Forever Bee Pollen to enhance your energy levels and maintain optimal health. It’s a convenient way to fuel your body with nature’s superfood.",
      rating: { stars: 5, count: 60 },
      priceCents: 230400,
      usage: "Take one tablet daily for an energy boost and overall wellness.",
      benefits: [
        {
          icon: "fa-solid fa-leaf",
          text: "Packed with natural vitamins and minerals",
        },
        { icon: "fa-solid fa-bolt", text: "Boosts energy and vitality" },
      ],
      gallery: [],
      categorySlug: "nutrition-supplement",
      keywords: ["bee", "pollen", "Kenya"],
      isOnOffer: false,
    },
    {
      image: "/images/products/forever-bee-propolis.jpg",
      name: "Forever Bee Propolis",
      description:
        "Forever Bee Propolis is a powerful natural supplement sourced from bee hives. It is packed with nutrients, including amino acids, enzymes, and bioflavonoids, that help boost immunity and promote overall wellness. This product is perfect for individuals looking for a natural way to strengthen their body’s defenses.\n\nWith Forever Bee Propolis, you can enjoy the benefits of one of nature’s most remarkable substances. It’s easy to incorporate into your daily health routine for long-term vitality.",
      rating: { stars: 4, count: 50 },
      priceCents: 495500,
      usage: "Take two tablets daily to boost your immune health.",
      benefits: [
        {
          icon: "fa-solid fa-shield-alt",
          text: "Boosts immune system naturally",
        },
        {
          icon: "fa-solid fa-bolt",
          text: "Packed with amino acids and bioflavonoids",
        },
      ],
      gallery: [],
      categorySlug: "nutrition-supplement",
      keywords: ["bee", "propolis", "Kenya"],
      isOnOffer: false,
    },
    {
      image: "/images/products/lite-ultra-chocolate.jpg",
      name: "Lite Ultra - 15 Serving - Chocolate",
      description:
        "Lite Ultra is a delicious, protein-rich shake designed to support weight management and muscle recovery. Made with a blend of high-quality soy protein and essential vitamins, this shake provides your body with the nutrients it needs to stay strong and energized. It’s a perfect addition to your fitness routine.\n\nWhether you’re looking to maintain a healthy weight or enhance your workout results, Lite Ultra is a convenient and tasty way to fuel your day. Enjoy the rich chocolate flavor while supporting your health goals.",
      rating: { stars: 3, count: 60 },
      priceCents: 468600,
      usage:
        "Mix one scoop with water or milk and enjoy daily as a meal replacement.",
      benefits: [
        {
          icon: "fa-solid fa-weight",
          text: "Supports weight management and muscle recovery",
        },
        {
          icon: "fa-solid fa-apple-alt",
          text: "Rich in protein and essential nutrients",
        },
      ],
      gallery: [],
      categorySlug: "nutrition-supplement",
      keywords: ["lite", "ultra", "chocolate", "Kenya"],
      isOnOffer: false,
    },
  ];

  try {
    // Clear the collection
    await Product.deleteMany({});
    console.log("Cleared Product collection.");

    // Insert sample products
    await Product.insertMany(products);
    console.log("Inserted sample products.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

// Run the seeding script
seedDatabase();
