require("dotenv").config();
const express = require("express");
const Joi = require("joi");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const sanitizeHtml = require("sanitize-html");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const logger = require("../startup/logger");

// ✅ Booking Model
const Booking = mongoose.model(
  "Booking",
  new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 50 },
    email: { type: String, required: true },
    phone: { type: String, required: true, match: /^\+?\d{10,15}$/ },
    date: { type: Date, required: true },
    message: { type: String, required: true, minlength: 10, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
  })
);

const router = express.Router();
router.use(mongoSanitize());

const BUSINESS_PHONE = process.env.BUSINESS_PHONE || "+254746577838";

// ✅ Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many requests. Please try again later.",
});

// ✅ Joi Schema
const bookingSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\+?\d{10,15}$/)
    .required(),
  date: Joi.date().greater("now").required(),
  message: Joi.string().min(10).max(500).required(),
});

// ✅ Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Booking Route
router.post("/", limiter, async (req, res) => {
  try {
    // Input Sanitization
    req.body.name = sanitizeHtml(req.body.name);
    req.body.email = sanitizeHtml(req.body.email);
    req.body.message = sanitizeHtml(req.body.message);

    // Validate Input
    const { error, value } = bookingSchema.validate(req.body);
    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, email, phone, date, message } = value;

    // ✅ Convert Date to Nairobi Time & Format with AM/PM
    const kenyanDate = new Intl.DateTimeFormat("en-KE", {
      timeZone: "Africa/Nairobi",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true, // Ensures AM/PM
    }).format(new Date(date));

    // ✅ Store Booking in MongoDB
    const booking = new Booking({ name, email, phone, date, message });
    await booking.save();
    logger.info(`📌 Booking saved: ${JSON.stringify(booking)}`);

    // 📌 Email Templates
    const userEmailTemplate = `
      <h2 style="color:#FFA500;">Consultation Booking Confirmation</h2>
      <p>Dear ${name},</p>
      <p>Your consultation is scheduled for <strong>${kenyanDate}</strong>.</p>
      <p><b>Message:</b> ${message}</p>
      <p>We will contact you at <strong>${phone}</strong> using <strong>${BUSINESS_PHONE}</strong>.</p>
      <br><p>Best regards,</p><p><b>Your Consultation Team</b></p>
    `;

    const adminEmailTemplate = `
      <h2 style="color:#FF0000;">New Consultation Booking</h2>
      <p>A new booking has been made:</p>
      <ul>
        <li><b>Name:</b> ${name}</li>
        <li><b>Email:</b> ${email}</li>
        <li><b>User's Phone:</b> ${phone}</li>
        <li><b>Preferred Date:</b> ${kenyanDate}</li>
        <li><b>Message:</b> ${message}</li>
        <li><b>Contact User via:</b> ${BUSINESS_PHONE}</li>
      </ul>
    `;

    // 📌 Send Emails in Parallel & Log Success
    await Promise.all([
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Consultation Confirmation",
        html: userEmailTemplate,
      }),
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: "New Booking",
        html: adminEmailTemplate,
      }),
    ]);

    logger.info(`📩 Emails sent successfully to ${email} and admin.`);
    res.json({ message: "Booking confirmed. Emails sent & saved!" });
  } catch (error) {
    logger.error(`Error saving booking/email: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
