const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for authentication routes.
 * 15 requests per 15‑minute window per IP.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});

module.exports = authLimiter;
