const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/db');

/**
 * RefreshToken "model" backed by lowdb (JSON file).
 * Shape: { _id, user, token, family, isRevoked, expiresAt, createdAt }
 */

const tokens = () => db.get('refreshTokens');

const RefreshToken = {
  create({ user, token, family, expiresAt }) {
    const doc = {
      _id: uuidv4(),
      user,
      token,
      family,
      isRevoked: false,
      expiresAt: expiresAt instanceof Date ? expiresAt.toISOString() : expiresAt,
      createdAt: new Date().toISOString(),
    };
    tokens().push(doc).write();
    return doc;
  },

  findOne(query) {
    return tokens().find(query).value() || null;
  },

  findOneAndUpdate(query, updates) {
    const doc = tokens().find(query);
    if (!doc.value()) return null;
    doc.assign(updates).write();
    return doc.value();
  },

  updateMany(query, updates) {
    const list = tokens().filter(query).value();
    list.forEach((item) => {
      tokens().find({ _id: item._id }).assign(updates).write();
    });
    return { modifiedCount: list.length };
  },

  // Clean up expired tokens (call periodically if desired)
  purgeExpired() {
    const now = new Date().toISOString();
    tokens().remove((t) => t.expiresAt < now).write();
  },
};

module.exports = RefreshToken;
