const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/db');

/**
 * MoodEntry model — AI mood journal.
 * Shape: { _id, user, mood, intensity, feelings[], note, reflection, date, createdAt }
 *
 * mood: 'happy' | 'calm' | 'anxious' | 'sad' | 'angry' | 'grateful' | 'tired' | 'hopeful' | 'overwhelmed' | 'neutral'
 * intensity: 1–5 (how strongly the mood is felt)
 * feelings: array of specific feelings tags
 */
const entries = () => db.get('moodEntries');

const MOODS = ['happy', 'calm', 'anxious', 'sad', 'angry', 'grateful', 'tired', 'hopeful', 'overwhelmed', 'neutral'];

const MoodEntry = {
  MOODS,

  findByUser(userId, filters = {}) {
    let list = entries().filter({ user: userId }).value();

    if (filters.mood) list = list.filter((e) => e.mood === filters.mood);
    if (filters.from) list = list.filter((e) => e.date >= filters.from);
    if (filters.to) list = list.filter((e) => e.date <= filters.to);

    list.sort((a, b) => new Date(b.date) - new Date(a.date));
    return list;
  },

  findById(id) {
    return entries().find({ _id: id }).value() || null;
  },

  create({ user, mood, intensity, feelings, note, reflection, date }) {
    const now = new Date().toISOString();
    const entry = {
      _id: uuidv4(),
      user,
      mood,
      intensity: Math.min(5, Math.max(1, Number(intensity) || 3)),
      feelings: feelings || [],
      note: (note || '').trim(),
      reflection: (reflection || '').trim(),
      date: date || now.slice(0, 10),
      createdAt: now,
    };
    entries().push(entry).write();
    return entry;
  },

  update(id, updates) {
    const entry = entries().find({ _id: id });
    if (!entry.value()) return null;
    entry.assign(updates).write();
    return entry.value();
  },

  delete(id) {
    const entry = entries().find({ _id: id }).value();
    if (!entry) return null;
    entries().remove({ _id: id }).write();
    return entry;
  },

  /**
   * Mood analytics for a user — mood distribution, streaks, patterns.
   */
  getAnalytics(userId, days = 30) {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const list = entries()
      .filter({ user: userId })
      .value()
      .filter((e) => e.date >= cutoff);

    const moodCounts = {};
    const dailyMoods = {};
    let totalIntensity = 0;

    list.forEach((e) => {
      moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
      dailyMoods[e.date] = e.mood;
      totalIntensity += e.intensity;
    });

    // Determine dominant mood
    let dominantMood = 'neutral';
    let maxCount = 0;
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantMood = mood;
      }
    });

    // Streak: consecutive days with entries
    const dates = Object.keys(dailyMoods).sort().reverse();
    let streak = 0;
    const today = new Date().toISOString().slice(0, 10);
    let check = today;
    for (const d of dates) {
      if (d === check) {
        streak++;
        const prev = new Date(check);
        prev.setDate(prev.getDate() - 1);
        check = prev.toISOString().slice(0, 10);
      } else break;
    }

    return {
      totalEntries: list.length,
      moodDistribution: moodCounts,
      dominantMood,
      averageIntensity: list.length ? +(totalIntensity / list.length).toFixed(1) : 0,
      journalStreak: streak,
      period: `${days} days`,
    };
  },
};

module.exports = MoodEntry;
