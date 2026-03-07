const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const authLimiter = require('../middleware/rateLimiter');
const authMiddleware = require('../middleware/auth');
const {
  register,
  verifyOTP,
  resendOTP,
  login,
  refreshToken,
  logout,
  logoutAll,
} = require('../controllers/authController');

const router = express.Router();

// Apply rate limiter to all auth routes
router.use(authLimiter);

// ── Register ──
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required.'),
    body('phone').optional().trim(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters.')
      .matches(/\d/)
      .withMessage('Password must contain a number.')
      .matches(/[A-Z]/)
      .withMessage('Password must contain an uppercase letter.'),
  ],
  validate,
  register
);

// ── Verify OTP ──
router.post(
  '/verify-otp',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required.'),
    body('otp')
      .isLength({ min: 6, max: 6 })
      .isNumeric()
      .withMessage('OTP must be a 6‑digit number.'),
  ],
  validate,
  verifyOTP
);

// ── Resend OTP ──
router.post(
  '/resend-otp',
  [body('email').isEmail().normalizeEmail().withMessage('Valid email is required.')],
  validate,
  resendOTP
);

// ── Login ──
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  validate,
  login
);

// ── Refresh Token ──
router.post('/refresh', refreshToken);

// ── Logout ──
router.post('/logout', logout);

// ── Logout All (requires access token) ──
router.post('/logout-all', authMiddleware, logoutAll);

module.exports = router;
