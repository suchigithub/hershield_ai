const User = require('../models/User');

// ────────────────────────────────────────────────
// GET /api/users/me  (auth required)
// ────────────────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const user = User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.json({ user: User.sanitize(user) });
  } catch (err) {
    console.error('[Hershild] getProfile error:', err);
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
    console.error('[Hershild] updateProfile error:', err);
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
    console.error('[Hershild] deleteAccount error:', err);
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
    console.error('[Hershild] getAllUsers error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
