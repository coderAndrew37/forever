const products = require("../routes/products.js");
const auth = require("../routes/auth.js");
const cart = require("../routes/cart.js");
const passwordReset = require("../routes/passwordReset.js");
const faqs = require("../routes/faqs.js");
const contacts = require("../routes/contacts.js");
const quiz = require("../routes/quiz.js");
const newsletter = require("../routes/newsletter.js");
const orders = require("../routes/orders.js");
const packs = require("../routes/packs.js");
const offers = require("../routes/offers.js");
const booking = require("../routes/booking.js");
const testimonials = require("../routes/testimonials.js");
const admin = require("../routes/admin.js"); // ✅ Added Admin Route

module.exports = function (app) {
  app.use("/api/products", products);
  app.use("/api/users", auth);
  app.use("/api/cart", cart);
  app.use("/api/password-reset", passwordReset);
  app.use("/api/faqs", faqs);
  app.use("/api/contacts", contacts);
  app.use("/api/submit-quiz", quiz);
  app.use("/api/newsletter", newsletter);
  app.use("/api/orders", orders);
  app.use("/api/packs", packs);
  app.use("/api/offers", offers);
  app.use("/api/bookings", booking);
  app.use("/api/testimonials", testimonials);
  app.use("/api/admin", admin); // ✅ Now the admin panel API is accessible
};
