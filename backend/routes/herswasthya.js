const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');
const c = require('../controllers/herswasthyaController');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// ── Dashboard ─────────────────────────────────
router.get('/dashboard', c.getDashboard);

// ── Period Tracker ────────────────────────────
router.get('/period', c.getPeriodLogs);
router.get('/period/analytics', c.getPeriodAnalytics);
router.get('/symptoms', c.getSymptomsList);

router.post(
  '/period',
  [
    body('startDate').isISO8601().withMessage('Valid start date required (YYYY-MM-DD).'),
    body('endDate').optional().isISO8601(),
    body('symptoms').optional().isArray(),
    body('flow').optional().isIn(['light', 'medium', 'heavy']),
    body('notes').optional().trim(),
  ],
  validate,
  c.logPeriod
);

router.delete('/period/:id', c.deletePeriodLog);

// ── Health Tips ───────────────────────────────
router.get('/tips', c.getHealthTips);

// ── Nearby Clinics ────────────────────────────
router.get('/clinics', c.getNearbyClinics);

// ── Telemedicine ──────────────────────────────
router.get('/doctors', c.getDoctors);
router.get('/consult', c.getConsultations);

router.post(
  '/consult',
  [
    body('doctorId').trim().notEmpty().withMessage('Doctor ID is required.'),
    body('scheduledAt').optional().isISO8601(),
    body('notes').optional().trim(),
  ],
  validate,
  c.bookConsultation
);

router.post('/consult/:id/cancel', c.cancelConsultation);

// ── Daily Workouts ────────────────────────────
router.get('/workouts', c.getWorkouts);
router.get('/workouts/stats', c.getWorkoutStats);
router.get('/workouts/:id', c.getWorkoutById);
router.post('/workouts/:id/complete', c.completeWorkout);

// ── Workout Planner ───────────────────────────
router.get('/planner', c.getPlanner);

router.post(
  '/planner',
  [
    body('day').isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']).withMessage('Invalid day.'),
    body('title').trim().notEmpty().withMessage('Title required.'),
    body('workoutId').optional().trim(),
    body('time').optional().trim(),
    body('notes').optional().trim(),
  ],
  validate,
  c.addPlannerEntry
);

router.delete('/planner/:id', c.deletePlannerEntry);

router.post(
  '/planner/suggested',
  [body('level').optional().isIn(['beginner', 'intermediate'])],
  validate,
  c.loadSuggestedPlan
);

// ── Nearby Coaches ────────────────────────────
router.get('/coaches', c.getCoaches);

// ── Smartwatch ────────────────────────────────
router.get('/smartwatch/brands', c.getSupportedBrands);
router.get('/smartwatch/devices', c.getLinkedDevices);

router.post(
  '/smartwatch/link',
  [
    body('brand').trim().notEmpty().withMessage('Brand is required.'),
    body('model').trim().notEmpty().withMessage('Model is required.'),
    body('deviceName').optional().trim(),
  ],
  validate,
  c.linkSmartwatch
);

router.delete('/smartwatch/devices/:id', c.unlinkSmartwatch);

router.post(
  '/smartwatch/sync',
  [
    body('deviceId').trim().notEmpty().withMessage('Device ID is required.'),
    body('heartRate').optional().isFloat({ min: 30, max: 250 }),
    body('spo2').optional().isFloat({ min: 50, max: 100 }),
    body('steps').optional().isInt({ min: 0 }),
    body('calories').optional().isFloat({ min: 0 }),
    body('stress').optional().isFloat({ min: 0, max: 100 }),
    body('temperature').optional().isFloat({ min: 30, max: 45 }),
  ],
  validate,
  c.syncVitals
);

router.get('/smartwatch/vitals', c.getVitals);

module.exports = router;
