const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/db');

/**
 * MeditationLog model — tracks completed guided meditation sessions.
 * Shape: { _id, user, sessionId, title, durationMin, completedAt }
 */
const logs = () => db.get('meditationLogs');

const MeditationLog = {
  findByUser(userId) {
    return logs()
      .filter({ user: userId })
      .value()
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  },

  create({ user, sessionId, title, durationMin }) {
    const log = {
      _id: uuidv4(),
      user,
      sessionId,
      title,
      durationMin: Number(durationMin),
      completedAt: new Date().toISOString(),
    };
    logs().push(log).write();
    return log;
  },

  getStats(userId) {
    const userLogs = logs().filter({ user: userId }).value();
    const totalMin = userLogs.reduce((acc, l) => acc + l.durationMin, 0);
    return {
      totalSessions: userLogs.length,
      totalMinutes: totalMin,
      averageMinutes: userLogs.length ? +(totalMin / userLogs.length).toFixed(1) : 0,
    };
  },
};

module.exports = MeditationLog;
