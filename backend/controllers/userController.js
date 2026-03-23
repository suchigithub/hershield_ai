const User = require('../models/User');
const { getSafetyTips, getDailySafetyDigest, getContextualTip } = require('../services/safetyTipsService');

// ────────────────────────────────────────────────
// GET /api/users/me  (auth required)
// ────────────────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const user = User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.json({ user: User.sanitize(user) });
  } catch (err) {
    console.error('[HERSHIELD] getProfile error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ────────────────────────────────────────────────
// PUT /api/users/me  (auth required)
// ────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'phone'];
    const updates = {};
    allowedFields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    const user = User.findByIdAndUpdate(req.user.id, updates);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.json({ message: 'Profile updated.', user: User.sanitize(user) });
  } catch (err) {
    console.error('[HERSHIELD] updateProfile error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ────────────────────────────────────────────────
// DELETE /api/users/me  (auth required)
// ────────────────────────────────────────────────
exports.deleteAccount = async (req, res) => {
  try {
    User.findByIdAndDelete(req.user.id);
    res.clearCookie('refreshToken', { path: '/api/auth' });
    return res.json({ message: 'Account deleted.' });
  } catch (err) {
    console.error('[HERSHIELD] deleteAccount error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ────────────────────────────────────────────────
// GET /api/users  (admin only – optional)
// ────────────────────────────────────────────────
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required.' });
    }
    const users = User.find();
    return res.json({ users: users.map(User.sanitize) });
  } catch (err) {
    console.error('[HERSHIELD] getAllUsers error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ────────────────────────────────────────────────
// GET /api/users/safety-tips  (AI safety digest)
// ────────────────────────────────────────────────
exports.getSafetyDigest = (req, res) => {
  try {
    const digest = getDailySafetyDigest();
    return res.json({ digest });
  } catch (err) {
    console.error('[HERSHIELD] getSafetyDigest error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ────────────────────────────────────────────────
// GET /api/users/safety-tips/:module  (per-module tips)
// ────────────────────────────────────────────────
exports.getModuleSafetyTips = (req, res) => {
  try {
    const { module } = req.params;
    const { tag } = req.query;
    const data = getSafetyTips(module, tag);
    return res.json({ data });
  } catch (err) {
    console.error('[HERSHIELD] getModuleSafetyTips error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ────────────────────────────────────────────────
// GET /api/users/safety-tip  (contextual single tip)
// ────────────────────────────────────────────────
exports.getContextualSafetyTip = (req, res) => {
  try {
    const context = req.query.context || 'general';
    const tip = getContextualTip(context);
    return res.json({ tip });
  } catch (err) {
    console.error('[HERSHIELD] getContextualSafetyTip error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
