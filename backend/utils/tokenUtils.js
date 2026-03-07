const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const RefreshToken = require('../models/RefreshToken');

/**
 * Generate a short‑lived access token.
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
  );
};

/**
 * Generate a long‑lived refresh token, persist it in DB with a family id.
 * The family enables rotation‑detection: if a token from the same family
 * is reused after rotation, all tokens in that family are revoked.
 */
const generateRefreshToken = async (user, family = null) => {
  const tokenFamily = family || uuidv4();
  const payload = { id: user._id, family: tokenFamily };
  const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d',
  });

  const decoded = jwt.decode(token);

  RefreshToken.create({
    user: user._id,
    token,
    family: tokenFamily,
    expiresAt: new Date(decoded.exp * 1000).toISOString(),
  });

  return token;
};

/**
 * Revoke a single refresh token.
 */
const revokeRefreshToken = (token) => {
  RefreshToken.findOneAndUpdate({ token }, { isRevoked: true });
};

/**
 * Revoke ALL tokens in a family (used when reuse is detected).
 */
const revokeFamily = (family) => {
  RefreshToken.updateMany({ family }, { isRevoked: true });
};

/**
 * Revoke all refresh tokens for a user (full logout).
 */
const revokeAllUserTokens = (userId) => {
  RefreshToken.updateMany({ user: userId }, { isRevoked: true });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  revokeRefreshToken,
  revokeFamily,
  revokeAllUserTokens,
};
