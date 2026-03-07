const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/db');

/**
 * PeriodLog model — menstrual cycle tracker.
 * Shape: { _id, user, startDate, endDate, cycleLength, symptoms[], flow, notes, predictedNext, createdAt }
 */
const logs = () => db.get('periodLogs');

const PeriodLog = {
  findByUser(userId) {
    return logs()
      .filter({ user: userId })
      .value()
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  },

  findById(id) {
    return logs().find({ _id: id }).value() || null;
  },

  create({ user, startDate, endDate, symptoms, flow, notes }) {
    const now = new Date().toISOString();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    const durationDays = end ? Math.ceil((end - start) / (1000 * 60 * 60 * 24)) : null;

    // Calculate cycle length from previous period
    const prev = logs()
      .filter({ user })
      .value()
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))[0];

    let cycleLength = 28; // default
    if (prev) {
      const daysBetween = Math.ceil((start - new Date(prev.startDate)) / (1000 * 60 * 60 * 24));
      if (daysBetween > 15 && daysBetween < 60) cycleLength = daysBetween;
    }

    // Predict next period
    const predictedNext = new Date(start);
    predictedNext.setDate(predictedNext.getDate() + cycleLength);

    const log = {
      _id: uuidv4(),
      user,
      startDate: start.toISOString().slice(0, 10),
      endDate: end ? end.toISOString().slice(0, 10) : null,
      durationDays,
      cycleLength,
      symptoms: symptoms || [],
      flow: flow || 'medium', // 'light' | 'medium' | 'heavy'
      notes: (notes || '').trim(),
      predictedNext: predictedNext.toISOString().slice(0, 10),
      createdAt: now,
    };

    logs().push(log).write();
    return log;
  },

  update(id, updates) {
    const log = logs().find({ _id: id });
    if (!log.value()) return null;
    log.assign(updates).write();
    return log.value();
  },

  delete(id) {
    const log = logs().find({ _id: id }).value();
    if (!log) return null;
    logs().remove({ _id: id }).write();
    return log;
  },

  /**
   * Get cycle analytics for a user.
   */
  getAnalytics(userId) {
    const userLogs = this.findByUser(userId);
    if (userLogs.length === 0) return { totalLogs: 0 };

    const cycleLengths = userLogs.map((l) => l.cycleLength).filter(Boolean);
    const durations = userLogs.map((l) => l.durationDays).filter(Boolean);
    const avgCycle = cycleLengths.length
      ? +(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length).toFixed(1)
      : 28;
    const avgDuration = durations.length
      ? +(durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1)
      : null;

    // Symptom frequency
    const symptomCounts = {};
    userLogs.forEach((l) => {
      (l.symptoms || []).forEach((s) => {
        symptomCounts[s] = (symptomCounts[s] || 0) + 1;
      });
    });

    const latest = userLogs[0];

    return {
      totalLogs: userLogs.length,
      averageCycleLength: avgCycle,
      averageDuration: avgDuration,
      predictedNext: latest?.predictedNext || null,
      commonSymptoms: Object.entries(symptomCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([symptom, count]) => ({ symptom, count })),
      lastPeriod: latest?.startDate || null,
    };
  },
};

module.exports = PeriodLog;
