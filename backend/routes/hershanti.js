const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');
const c = require('../controllers/hershantiController');

const router = express.Router();

// All HerShanti routes require authentication
router.use(authMiddleware);

// ── Daily Wellness Summary ────────────────────
router.get('/daily', c.getDailyWellness);

// ── Mood Journal ──────────────────────────────
router.get('/mood', c.getMoodEntries);
router.get('/mood/analytics', c.getMoodAnalytics);
router.get('/mood/prompt', c.getReflectionPrompt);

router.post(
  '/mood',
  [
    body('mood')
      .isIn(['happy', 'calm', 'anxious', 'sad', 'angry', 'grateful', 'tired', 'hopeful', 'overwhelmed', 'neutral'])
      .withMessage('Invalid mood.'),
    body('intensity').optional().isInt({ min: 1, max: 5 }),
    body('feelings').optional().isArray(),
    body('note').optional().trim(),
    body('date').optional().isISO8601(),
  ],
  validate,
  c.createMoodEntry
);

router.delete('/mood/:id', c.deleteMoodEntry);

// ── Guided Meditation ─────────────────────────
router.get('/meditations', c.getMeditations);
router.get('/meditations/stats', c.getMeditationStats);
router.get('/meditations/:id', c.getMeditationById);
router.post('/meditations/:id/complete', c.completeMeditation);

// ── Therapist Directory ───────────────────────
router.get('/therapists', c.getTherapists);

// ── Support Groups ────────────────────────────
router.get('/groups', c.getGroups);

router.post(
  '/groups',
  [
    body('name').trim().notEmpty().withMessage('Group name is required.'),
    body('description').optional().trim(),
    body('category').optional().trim(),
  ],
  validate,
  c.createGroup
);

router.post('/groups/:id/join', c.joinGroup);
router.post('/groups/:id/leave', c.leaveGroup);
router.get('/groups/:id/messages', c.getGroupMessages);

router.post(
  '/groups/:id/messages',
  [body('message').trim().notEmpty().withMessage('Message cannot be empty.')],
  validate,
  c.postGroupMessage
);

// ── Motivational Videos ───────────────────────
router.get('/videos', c.getVideos);
router.get('/videos/:id', c.getVideoById);

// ── AI Notifications ──────────────────────────
router.get('/notifications', c.getNotifications);

module.exports = router;
