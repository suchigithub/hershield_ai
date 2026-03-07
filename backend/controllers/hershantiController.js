const MoodEntry = require('../models/MoodEntry');
const MeditationLog = require('../models/MeditationLog');
const SupportGroup = require('../models/SupportGroup');
const User = require('../models/User');
const {
  getMeditations,
  getMeditationById,
  getTherapists,
  getReflectionPrompt,
  getRandomAffirmation,
} = require('../services/wellnessService');

// ╔══════════════════════════════════════════════╗
// ║  MOOD JOURNAL                                 ║
// ╚══════════════════════════════════════════════╝

// GET /api/hershanti/mood
exports.getMoodEntries = (req, res) => {
  try {
    const { mood, from, to } = req.query;
    const entries = MoodEntry.findByUser(req.user.id, { mood, from, to });
    return res.json({ entries });
  } catch (err) {
    console.error('[HerShanti] getMoodEntries error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/hershanti/mood
exports.createMoodEntry = (req, res) => {
  try {
    const { mood, intensity, feelings, note, date } = req.body;

    const entry = MoodEntry.create({
      user: req.user.id,
      mood,
      intensity,
      feelings,
      note,
      date,
    });

    // Generate a reflection prompt based on mood
    const reflectionPrompt = getReflectionPrompt(mood);
    const affirmation = getRandomAffirmation();

    return res.status(201).json({
      message: 'Mood logged. Remember, every feeling is valid. 💜',
      entry,
      reflectionPrompt,
      affirmation,
    });
  } catch (err) {
    console.error('[HerShanti] createMoodEntry error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// GET /api/hershanti/mood/analytics
exports.getMoodAnalytics = (req, res) => {
  try {
    const days = Number(req.query.days) || 30;
    const analytics = MoodEntry.getAnalytics(req.user.id, days);
    return res.json({ analytics });
  } catch (err) {
    console.error('[HerShanti] getMoodAnalytics error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// DELETE /api/hershanti/mood/:id
exports.deleteMoodEntry = (req, res) => {
  try {
    const entry = MoodEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found.' });
    if (entry.user !== req.user.id) return res.status(403).json({ message: 'Access denied.' });
    MoodEntry.delete(req.params.id);
    return res.json({ message: 'Entry removed.' });
  } catch (err) {
    console.error('[HerShanti] deleteMoodEntry error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// GET /api/hershanti/mood/prompt
exports.getReflectionPrompt = (req, res) => {
  try {
    const mood = req.query.mood || 'neutral';
    return res.json({
      prompt: getReflectionPrompt(mood),
      affirmation: getRandomAffirmation(),
    });
  } catch (err) {
    console.error('[HerShanti] getReflectionPrompt error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ╔══════════════════════════════════════════════╗
// ║  GUIDED MEDITATION                            ║
// ╚══════════════════════════════════════════════╝

// GET /api/hershanti/meditations
exports.getMeditations = (req, res) => {
  try {
    const { category } = req.query;
    const sessions = getMeditations(category);
    return res.json({ sessions });
  } catch (err) {
    console.error('[HerShanti] getMeditations error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// GET /api/hershanti/meditations/:id
exports.getMeditationById = (req, res) => {
  try {
    const session = getMeditationById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found.' });
    return res.json({ session });
  } catch (err) {
    console.error('[HerShanti] getMeditationById error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/hershanti/meditations/:id/complete
exports.completeMeditation = (req, res) => {
  try {
    const session = getMeditationById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found.' });

    const log = MeditationLog.create({
      user: req.user.id,
      sessionId: session.id,
      title: session.title,
      durationMin: session.durationMin,
    });

    const stats = MeditationLog.getStats(req.user.id);

    return res.json({
      message: `Beautiful! You completed "${session.title}". 🧘`,
      log,
      stats,
      affirmation: getRandomAffirmation(),
    });
  } catch (err) {
    console.error('[HerShanti] completeMeditation error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// GET /api/hershanti/meditations/stats
exports.getMeditationStats = (req, res) => {
  try {
    const stats = MeditationLog.getStats(req.user.id);
    const history = MeditationLog.findByUser(req.user.id);
    return res.json({ stats, history: history.slice(0, 20) });
  } catch (err) {
    console.error('[HerShanti] getMeditationStats error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ╔══════════════════════════════════════════════╗
// ║  THERAPIST CONNECT                            ║
// ╚══════════════════════════════════════════════╝

// GET /api/hershanti/therapists
exports.getTherapists = (req, res) => {
  try {
    const { speciality, city, available } = req.query;
    const therapists = getTherapists({
      speciality,
      city,
      available: available === 'true',
    });
    return res.json({ therapists });
  } catch (err) {
    console.error('[HerShanti] getTherapists error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ╔══════════════════════════════════════════════╗
// ║  SUPPORT GROUPS                               ║
// ╚══════════════════════════════════════════════╝

// GET /api/hershanti/groups
exports.getGroups = (req, res) => {
  try {
    const groups = SupportGroup.findAll();
    return res.json({ groups: groups.map((g) => ({ ...g, memberCount: g.members.length })) });
  } catch (err) {
    console.error('[HerShanti] getGroups error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/hershanti/groups
exports.createGroup = (req, res) => {
  try {
    const { name, description, category } = req.body;
    const group = SupportGroup.create({ name, description, category });
    // Creator auto-joins
    SupportGroup.join(group._id, req.user.id);
    return res.status(201).json({ message: 'Support group created.', group });
  } catch (err) {
    console.error('[HerShanti] createGroup error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/hershanti/groups/:id/join
exports.joinGroup = (req, res) => {
  try {
    const group = SupportGroup.join(req.params.id, req.user.id);
    if (!group) return res.status(404).json({ message: 'Group not found.' });
    return res.json({ message: 'You joined the group. Welcome! 🤝', group });
  } catch (err) {
    console.error('[HerShanti] joinGroup error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/hershanti/groups/:id/leave
exports.leaveGroup = (req, res) => {
  try {
    const group = SupportGroup.leave(req.params.id, req.user.id);
    if (!group) return res.status(404).json({ message: 'Group not found.' });
    return res.json({ message: 'You left the group.', group });
  } catch (err) {
    console.error('[HerShanti] leaveGroup error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// GET /api/hershanti/groups/:id/messages
exports.getGroupMessages = (req, res) => {
  try {
    const group = SupportGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found.' });
    if (!group.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'Join the group first.' });
    }
    const msgs = SupportGroup.getMessages(req.params.id);
    return res.json({ messages: msgs });
  } catch (err) {
    console.error('[HerShanti] getGroupMessages error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/hershanti/groups/:id/messages
exports.postGroupMessage = (req, res) => {
  try {
    const group = SupportGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found.' });
    if (!group.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'Join the group first.' });
    }

    const user = User.findById(req.user.id);
    const msg = SupportGroup.postMessage({
      groupId: req.params.id,
      user: req.user.id,
      userName: user ? user.name.split(' ')[0] : 'Anonymous',
      message: req.body.message,
    });
    return res.status(201).json({ message: 'Message sent.', data: msg });
  } catch (err) {
    console.error('[HerShanti] postGroupMessage error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ╔══════════════════════════════════════════════╗
// ║  DAILY WELLNESS                               ║
// ╚══════════════════════════════════════════════╝

// GET /api/hershanti/daily
exports.getDailyWellness = (req, res) => {
  try {
    const affirmation = getRandomAffirmation();
    const prompt = getReflectionPrompt('neutral');
    const meditationStats = MeditationLog.getStats(req.user.id);
    const moodAnalytics = MoodEntry.getAnalytics(req.user.id, 7);

    return res.json({
      greeting: 'Welcome to your safe space. 💜',
      affirmation,
      reflectionPrompt: prompt,
      weeklyMood: moodAnalytics,
      meditationStats,
    });
  } catch (err) {
    console.error('[HerShanti] getDailyWellness error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
