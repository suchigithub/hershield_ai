const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/db');

/**
 * WorkoutLog model — tracks completed workouts.
 * Shape: { _id, user, workoutId, title, category, durationMin, caloriesBurned, completedAt }
 */
const logs = () => db.get('workoutLogs');

/**
 * WorkoutPlan model — user's weekly workout planner.
 * Shape: { _id, user, day, workoutId, title, time, notes, createdAt }
 */
const plans = () => db.get('workoutPlans');

const WorkoutLog = {
  findByUser(userId) {
    return logs()
      .filter({ user: userId })
      .value()
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  },

  create({ user, workoutId, title, category, durationMin, caloriesBurned }) {
    const log = {
      _id: uuidv4(),
      user,
      workoutId,
      title,
      category: category || 'general',
      durationMin: Number(durationMin),
      caloriesBurned: Number(caloriesBurned) || 0,
      completedAt: new Date().toISOString(),
    };
    logs().push(log).write();
    return log;
  },

  getStats(userId, days = 7) {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const recent = logs()
      .filter({ user: userId })
      .value()
      .filter((l) => l.completedAt >= cutoff);

    const totalMin = recent.reduce((a, l) => a + l.durationMin, 0);
    const totalCal = recent.reduce((a, l) => a + l.caloriesBurned, 0);

    // Streak: consecutive days with at least one workout
    const allLogs = logs().filter({ user: userId }).value();
    const daySet = new Set(allLogs.map((l) => l.completedAt.slice(0, 10)));
    let streak = 0;
    let check = new Date().toISOString().slice(0, 10);
    while (daySet.has(check)) {
      streak++;
      const d = new Date(check);
      d.setDate(d.getDate() - 1);
      check = d.toISOString().slice(0, 10);
    }

    return {
      sessionsThisWeek: recent.length,
      minutesThisWeek: totalMin,
      caloriesThisWeek: totalCal,
      streak,
      totalAll: allLogs.length,
    };
  },
};

const WorkoutPlan = {
  findByUser(userId) {
    const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const all = plans().filter({ user: userId }).value();
    // Sort by day order
    return all.sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day));
  },

  findById(id) {
    return plans().find({ _id: id }).value() || null;
  },

  create({ user, day, workoutId, title, time, notes }) {
    const plan = {
      _id: uuidv4(),
      user,
      day: day.toLowerCase(),
      workoutId: workoutId || null,
      title: (title || '').trim(),
      time: time || '07:00',
      notes: (notes || '').trim(),
      createdAt: new Date().toISOString(),
    };
    plans().push(plan).write();
    return plan;
  },

  update(id, updates) {
    const plan = plans().find({ _id: id });
    if (!plan.value()) return null;
    plan.assign(updates).write();
    return plan.value();
  },

  delete(id) {
    const plan = plans().find({ _id: id }).value();
    if (!plan) return null;
    plans().remove({ _id: id }).write();
    return plan;
  },
};

module.exports = { WorkoutLog, WorkoutPlan };
