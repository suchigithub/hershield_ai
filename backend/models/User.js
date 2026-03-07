const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/db');

/**
 * User "model" backed by lowdb (JSON file).
 * Each user object shape:
 * { _id, name, email, phone, password, isVerified, otp: { code, expiresAt }, role, createdAt, updatedAt }
 */

const users = () => db.get('users');

const User = {
  // ── Find helpers ───────────────────────────────
  findOne(query) {
    return users().find(query).value() || null;
  },

  findById(id) {
    return users().find({ _id: id }).value() || null;
  },

  find(query = {}) {
    if (Object.keys(query).length === 0) return users().value();
    return users().filter(query).value();
  },

  // ── Create ─────────────────────────────────────
  async create({ name, email, phone, password, otp, role }) {
    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(password, salt);
    const now = new Date().toISOString();
    const user = {
      _id: uuidv4(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: (phone || '').trim(),
      password: hashed,
      isVerified: false,
      otp: otp || { code: null, expiresAt: null },
      role: role || 'user',
      createdAt: now,
      updatedAt: now,
    };
    users().push(user).write();
    return user;
  },

  // ── Update by id ───────────────────────────────
  findByIdAndUpdate(id, updates, _opts = {}) {
    const user = users().find({ _id: id });
    if (!user.value()) return null;
    updates.updatedAt = new Date().toISOString();
    user.assign(updates).write();
    return user.value();
  },

  // ── Save an already-mutated user object ────────
  save(userObj) {
    const target = users().find({ _id: userObj._id });
    if (!target.value()) return null;
    userObj.updatedAt = new Date().toISOString();
    target.assign(userObj).write();
    return userObj;
  },

  // ── Delete ─────────────────────────────────────
  findByIdAndDelete(id) {
    const user = users().find({ _id: id }).value();
    if (!user) return null;
    users().remove({ _id: id }).write();
    return user;
  },

  // ── Password comparison ────────────────────────
  async comparePassword(plain, hash) {
    return bcrypt.compare(plain, hash);
  },

  // ── Strip sensitive fields for API responses ───
  sanitize(userObj) {
    if (!userObj) return null;
    const copy = { ...userObj };
    delete copy.password;
    delete copy.otp;
    return copy;
  },
};

module.exports = User;
