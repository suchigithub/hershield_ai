const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  deleteAccount,
  getAllUsers,
  getSafetyDigest,
  getModuleSafetyTips,
  getContextualSafetyTip,
} = require('../controllers/userController');

const router = express.Router();

// All routes below require authentication
router.use(authMiddleware);

// ── Get current user ──
router.get('/me', getProfile);

// ── Update current user ──
router.put(
  '/me',
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty.'),
    body('phone').optional().trim(),
  ],
  validate,
  updateProfile
);

// ── Delete current user ──
router.delete('/me', deleteAccount);

// ── AI Safety Suggestions ──
router.get('/safety-tips', getSafetyDigest);
router.get('/safety-tips/:module', getModuleSafetyTips);
router.get('/safety-tip', getContextualSafetyTip);

// ── Admin: list all users ──
router.get('/', getAllUsers);

module.exports = router;
