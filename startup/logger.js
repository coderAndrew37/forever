const fs = require("fs");
const path = require("path");
const winston = require("winston");
require("winston-mongodb");
const DailyRotateFile = require("winston-daily-rotate-file");

// ✅ Ensure logs directory exists
const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// ✅ Define Log Transports (Console, File, MongoDB in Production)
const transports = [
  new winston.transports.Console({
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),

  new DailyRotateFile({
    filename: path.join(logDir, "application-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxSize: "20m", // Max 20MB per file
    maxFiles: "14d", // Keep logs for 14 days
    level: "info",
  }),

  new winston.transports.File({
    filename: path.join(logDir, "error.log"),
    level: "error",
  }),
];

// ✅ Add MongoDB Transport in Production
if (process.env.NODE_ENV === "production") {
  transports.push(
    new winston.transports.MongoDB({
      db: process.env.MONGODB_URI,
      options: { useUnifiedTopology: true },
      collection: "logs", // Stores logs in MongoDB
      level: "error",
      handleExceptions: true,
    })
  );
}

// ✅ Create Winston Logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports,
  exitOnError: false, // Prevent app from crashing on logging errors
});

// ✅ Helper function to log errors with stack traces
logger.logError = (message, error) => {
  logger.error(`${message}: ${error.stack || error}`);
};

module.exports = logger;
