const PeriodLog = require('../models/PeriodLog');
const Teleconsultation = require('../models/Teleconsultation');
const { WorkoutLog, WorkoutPlan } = require('../models/Workout');
const { SmartwatchDevice, SmartwatchVitals, SUPPORTED_BRANDS } = require('../models/Smartwatch');
const {
  getHealthTips,
  getNearbyClinics,
  getDoctors,
  getDoctorById,
  SYMPTOMS,
} = require('../services/healthService');
const {
  getWorkouts,
  getWorkoutById,
  getCoaches,
  getSuggestedPlan,
} = require('../services/workoutService');

// ╔══════════════════════════════════════════════╗
// ║  DASHBOARD                                    ║
// ╚══════════════════════════════════════════════╝

// GET /api/herswasthya/dashboard
exports.getDashboard = (req, res) => {
  try {
    const analytics = PeriodLog.getAnalytics(req.user.id);
    const consults = Teleconsultation.findByUser(req.user.id);
    const upcoming = consults.filter((c) => c.status === 'scheduled');
    const tipOfDay = getHealthTips()[Math.floor(Math.random() * getHealthTips().length)];

    return res.json({
      greeting: 'Your health matters. 💗',
      periodAnalytics: analytics,
      upcomingConsultations: upcoming.length,
      tipOfDay,
    });
  } catch (err) {
    console.error('[HerSwasthya] getDashboard error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ╔══════════════════════════════════════════════╗
// ║  PERIOD TRACKER                               ║
// ╚══════════════════════════════════════════════╝

// GET /api/herswasthya/period
exports.getPeriodLogs = (req, res) => {
  try {
    const logs = PeriodLog.findByUser(req.user.id);
    return res.json({ logs });
  } catch (err) {
    console.error('[HerSwasthya] getPeriodLogs error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/herswasthya/period
exports.logPeriod = (req, res) => {
  try {
    const { startDate, endDate, symptoms, flow, notes } = req.body;
    const log = PeriodLog.create({
      user: req.user.id,
      startDate,
      endDate,
      symptoms,
      flow,
      notes,
    });
    return res.status(201).json({
      message: 'Period logged. Stay healthy! 💗',
      log,
    });
  } catch (err) {
    console.error('[HerSwasthya] logPeriod error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// GET /api/herswasthya/period/analytics
exports.getPeriodAnalytics = (req, res) => {
  try {
    const analytics = PeriodLog.getAnalytics(req.user.id);
    return res.json({ analytics });
  } catch (err) {
    console.error('[HerSwasthya] getPeriodAnalytics error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// DELETE /api/herswasthya/period/:id
exports.deletePeriodLog = (req, res) => {
  try {
    const log = PeriodLog.findById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log not found.' });
    if (log.user !== req.user.id) return res.status(403).json({ message: 'Access denied.' });
    PeriodLog.delete(req.params.id);
    return res.json({ message: 'Log deleted.' });
  } catch (err) {
    console.error('[HerSwasthya] deletePeriodLog error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// GET /api/herswasthya/symptoms
exports.getSymptomsList = (req, res) => {
  return res.json({ symptoms: SYMPTOMS });
};

// ╔══════════════════════════════════════════════╗
// ║  HEALTH TIPS                                  ║
// ╚══════════════════════════════════════════════╝

// GET /api/herswasthya/tips
exports.getHealthTips = (req, res) => {
  try {
    const { category } = req.query;
    const tips = getHealthTips(category);
    return res.json({ tips });
  } catch (err) {
    console.error('[HerSwasthya] getHealthTips error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ╔══════════════════════════════════════════════╗
// ║  NEARBY CLINICS                               ║
// ╚══════════════════════════════════════════════╝

// GET /api/herswasthya/clinics
exports.getNearbyClinics = (req, res) => {
  try {
    const { type, open } = req.query;
    const clinics = getNearbyClinics({ type, open });
    return res.json({ clinics });
  } catch (err) {
    console.error('[HerSwasthya] getNearbyClinics error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ╔══════════════════════════════════════════════╗
// ║  TELEMEDICINE                                 ║
// ╚══════════════════════════════════════════════╝

// GET /api/herswasthya/doctors
exports.getDoctors = (req, res) => {
  try {
    const { speciality, available } = req.query;
    const doctors = getDoctors({ speciality, available });
    return res.json({ doctors });
  } catch (err) {
    console.error('[HerSwasthya] getDoctors error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/herswasthya/consult
exports.bookConsultation = (req, res) => {
  try {
    const { doctorId, scheduledAt, notes } = req.body;
    const doctor = getDoctorById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found.' });
    if (!doctor.available) return res.status(400).json({ message: 'Doctor is not available right now.' });

    const consult = Teleconsultation.create({
      user: req.user.id,
      doctorId: doctor.id,
      doctorName: doctor.name,
      speciality: doctor.speciality,
      scheduledAt,
      notes,
    });

    return res.status(201).json({
      message: `Consultation booked with ${doctor.name}. 📱`,
      consultation: consult,
      doctor,
    });
  } catch (err) {
    console.error('[HerSwasthya] bookConsultation error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// GET /api/herswasthya/consult
exports.getConsultations = (req, res) => {
  try {
    const consults = Teleconsultation.findByUser(req.user.id);
    return res.json({ consultations: consults });
  } catch (err) {
    console.error('[HerSwasthya] getConsultations error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/herswasthya/consult/:id/cancel
exports.cancelConsultation = (req, res) => {
  try {
    const c = Teleconsultation.findById(req.params.id);
    if (!c) return res.status(404).json({ message: 'Consultation not found.' });
    if (c.user !== req.user.id) return res.status(403).json({ message: 'Access denied.' });
    Teleconsultation.cancel(req.params.id);
    return res.json({ message: 'Consultation cancelled.' });
  } catch (err) {
    console.error('[HerSwasthya] cancelConsultation error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ╔══════════════════════════════════════════════╗
// ║  DAILY WORKOUTS                               ║
// ╚══════════════════════════════════════════════╝

// GET /api/herswasthya/workouts
exports.getWorkouts = (req, res) => {
  try {
    const { category } = req.query;
    const workouts = getWorkouts(category);
    return res.json({ workouts });
  } catch (err) {
    console.error('[HerSwasthya] getWorkouts error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// GET /api/herswasthya/workouts/:id
exports.getWorkoutById = (req, res) => {
  try {
    const workout = getWorkoutById(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found.' });
    return res.json({ workout });
  } catch (err) {
    console.error('[HerSwasthya] getWorkoutById error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/herswasthya/workouts/:id/complete
exports.completeWorkout = (req, res) => {
  try {
    const workout = getWorkoutById(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found.' });

    const log = WorkoutLog.create({
      user: req.user.id,
      workoutId: workout.id,
      title: workout.title,
      category: workout.category,
      durationMin: workout.durationMin,
      caloriesBurned: workout.caloriesBurned,
    });

    const stats = WorkoutLog.getStats(req.user.id);
    return res.json({ message: `Great job! "${workout.title}" completed! 💪`, log, stats });
  } catch (err) {
    console.error('[HerSwasthya] completeWorkout error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// GET /api/herswasthya/workouts/stats
exports.getWorkoutStats = (req, res) => {
  try {
    const days = Number(req.query.days) || 7;
    const stats = WorkoutLog.getStats(req.user.id, days);
    const history = WorkoutLog.findByUser(req.user.id).slice(0, 20);
    return res.json({ stats, history });
  } catch (err) {
    console.error('[HerSwasthya] getWorkoutStats error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ╔══════════════════════════════════════════════╗
// ║  WORKOUT PLANNER                              ║
// ╚══════════════════════════════════════════════╝

// GET /api/herswasthya/planner
exports.getPlanner = (req, res) => {
  try {
    const plan = WorkoutPlan.findByUser(req.user.id);
    return res.json({ plan });
  } catch (err) {
    console.error('[HerSwasthya] getPlanner error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/herswasthya/planner
exports.addPlannerEntry = (req, res) => {
  try {
    const { day, workoutId, title, time, notes } = req.body;
    const entry = WorkoutPlan.create({ user: req.user.id, day, workoutId, title, time, notes });
    return res.status(201).json({ message: 'Plan entry added.', entry });
  } catch (err) {
    console.error('[HerSwasthya] addPlannerEntry error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// DELETE /api/herswasthya/planner/:id
exports.deletePlannerEntry = (req, res) => {
  try {
    const entry = WorkoutPlan.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found.' });
    if (entry.user !== req.user.id) return res.status(403).json({ message: 'Access denied.' });
    WorkoutPlan.delete(req.params.id);
    return res.json({ message: 'Plan entry removed.' });
  } catch (err) {
    console.error('[HerSwasthya] deletePlannerEntry error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/herswasthya/planner/suggested
exports.loadSuggestedPlan = (req, res) => {
  try {
    const level = req.body.level || 'beginner';
    const suggested = getSuggestedPlan(level);
    const created = [];
    suggested.forEach((s) => {
      const entry = WorkoutPlan.create({ user: req.user.id, day: s.day, workoutId: s.workoutId, title: s.title, time: '07:00' });
      created.push(entry);
    });
    return res.status(201).json({ message: `${level} plan loaded! 🗓️`, plan: created });
  } catch (err) {
    console.error('[HerSwasthya] loadSuggestedPlan error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ╔══════════════════════════════════════════════╗
// ║  NEARBY COACHES                               ║
// ╚══════════════════════════════════════════════╝

// GET /api/herswasthya/coaches
exports.getCoaches = (req, res) => {
  try {
    const { speciality } = req.query;
    const coaches = getCoaches({ speciality });
    return res.json({ coaches });
  } catch (err) {
    console.error('[HerSwasthya] getCoaches error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ╔══════════════════════════════════════════════╗
// ║  SMARTWATCH                                   ║
// ╚══════════════════════════════════════════════╝

// GET /api/herswasthya/smartwatch/brands
exports.getSupportedBrands = (req, res) => {
  return res.json({ brands: SUPPORTED_BRANDS });
};

// GET /api/herswasthya/smartwatch/devices
exports.getLinkedDevices = (req, res) => {
  try {
    const devices = SmartwatchDevice.findByUser(req.user.id);
    return res.json({ devices });
  } catch (err) {
    console.error('[HerSwasthya] getLinkedDevices error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/herswasthya/smartwatch/link
exports.linkSmartwatch = (req, res) => {
  try {
    const { deviceName, brand, model } = req.body;

    // Validate brand/model
    const brandEntry = SUPPORTED_BRANDS.find((b) => b.brand.toLowerCase() === brand.toLowerCase());
    if (!brandEntry) {
      return res.status(400).json({ message: `Unsupported brand: ${brand}. Check /smartwatch/brands for supported devices.` });
    }
    const validModel = brandEntry.models.find((m) => m.toLowerCase() === model.toLowerCase());
    if (!validModel) {
      return res.status(400).json({ message: `Unsupported model: ${model}. Supported ${brand} models: ${brandEntry.models.join(', ')}` });
    }

    // Check if same model already linked
    const existing = SmartwatchDevice.findByUser(req.user.id);
    const duplicate = existing.find((d) => d.brand.toLowerCase() === brand.toLowerCase() && d.model.toLowerCase() === model.toLowerCase());
    if (duplicate) {
      return res.status(409).json({ message: `${brand} ${model} is already linked.`, device: duplicate });
    }

    const device = SmartwatchDevice.link({
      user: req.user.id,
      deviceName: deviceName || `${brand} ${validModel}`,
      brand: brandEntry.brand,
      model: validModel,
    });

    return res.status(201).json({
      message: `⌚ ${device.deviceName} linked successfully!`,
      device,
    });
  } catch (err) {
    console.error('[HerSwasthya] linkSmartwatch error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// DELETE /api/herswasthya/smartwatch/devices/:id
exports.unlinkSmartwatch = (req, res) => {
  try {
    const device = SmartwatchDevice.findById(req.params.id);
    if (!device) return res.status(404).json({ message: 'Device not found.' });
    if (device.user !== req.user.id) return res.status(403).json({ message: 'Access denied.' });

    SmartwatchDevice.unlink(req.params.id);
    return res.json({ message: `${device.deviceName} unlinked. Health data from this device has been removed.` });
  } catch (err) {
    console.error('[HerSwasthya] unlinkSmartwatch error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/herswasthya/smartwatch/sync
exports.syncVitals = (req, res) => {
  try {
    const { deviceId, heartRate, spo2, steps, calories, sleep, stress, temperature } = req.body;

    const device = SmartwatchDevice.findById(deviceId);
    if (!device) return res.status(404).json({ message: 'Device not found. Link your smartwatch first.' });
    if (device.user !== req.user.id) return res.status(403).json({ message: 'Access denied.' });

    const entry = SmartwatchVitals.sync({
      user: req.user.id,
      deviceId,
      heartRate,
      spo2,
      steps,
      calories,
      sleep,
      stress,
      temperature,
    });

    return res.status(201).json({
      message: '📊 Vitals synced from your smartwatch!',
      vitals: entry,
    });
  } catch (err) {
    console.error('[HerSwasthya] syncVitals error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// GET /api/herswasthya/smartwatch/vitals
exports.getVitals = (req, res) => {
  try {
    const limit = Number(req.query.limit) || 50;
    const latest = SmartwatchVitals.getLatest(req.user.id);
    const history = SmartwatchVitals.findByUser(req.user.id, limit);
    const summary = SmartwatchVitals.getSummary(req.user.id, Number(req.query.days) || 7);

    return res.json({ latest, history, summary });
  } catch (err) {
    console.error('[HerSwasthya] getVitals error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
