const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/db');

/**
 * Teleconsultation model — virtual doctor appointments.
 * Shape: { _id, user, doctorId, doctorName, speciality, status, scheduledAt, notes, createdAt }
 */
const consults = () => db.get('teleconsultations');

const Teleconsultation = {
  findByUser(userId) {
    return consults()
      .filter({ user: userId })
      .value()
      .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt));
  },

  findById(id) {
    return consults().find({ _id: id }).value() || null;
  },

  create({ user, doctorId, doctorName, speciality, scheduledAt, notes }) {
    const now = new Date().toISOString();
    const consult = {
      _id: uuidv4(),
      user,
      doctorId,
      doctorName,
      speciality: speciality || 'General',
      status: 'scheduled', // 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
      scheduledAt: scheduledAt || now,
      notes: (notes || '').trim(),
      prescription: null,
      createdAt: now,
    };
    consults().push(consult).write();
    return consult;
  },

  updateStatus(id, status, prescription = null) {
    const c = consults().find({ _id: id });
    if (!c.value()) return null;
    const updates = { status };
    if (prescription) updates.prescription = prescription;
    c.assign(updates).write();
    return c.value();
  },

  cancel(id) {
    return this.updateStatus(id, 'cancelled');
  },

  delete(id) {
    const c = consults().find({ _id: id }).value();
    if (!c) return null;
    consults().remove({ _id: id }).write();
    return c;
  },
};

module.exports = Teleconsultation;
