const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/db');

/**
 * Smartwatch model — tracks linked wearable devices and synced health data.
 * Device shape:  { _id, user, deviceName, brand, model, linkedAt, lastSyncAt, status }
 * Vitals shape:  { _id, user, deviceId, heartRate, spo2, steps, calories, sleep, stress, syncedAt }
 */
const devices = () => db.get('smartwatchDevices');
const vitals  = () => db.get('smartwatchVitals');

const SUPPORTED_BRANDS = [
  { brand: 'Apple',   models: ['Apple Watch SE', 'Apple Watch Series 9', 'Apple Watch Ultra 2'] },
  { brand: 'Samsung', models: ['Galaxy Watch 6', 'Galaxy Watch FE', 'Galaxy Fit 3'] },
  { brand: 'Fitbit',  models: ['Charge 6', 'Versa 4', 'Sense 2', 'Inspire 3'] },
  { brand: 'Noise',   models: ['ColorFit Pro 5', 'ColorFit Ultra 3', 'Pulse 4'] },
  { brand: 'boAt',    models: ['Wave Sigma 3', 'Lunar Oasis', 'Storm Call 3'] },
  { brand: 'Xiaomi',  models: ['Mi Band 8', 'Redmi Watch 4', 'Smart Band 8 Pro'] },
  { brand: 'Amazfit', models: ['GTR 4', 'GTS 4 Mini', 'Band 7'] },
  { brand: 'Garmin',  models: ['Venu 3S', 'Lily 2', 'vívoactive 5'] },
];

const SmartwatchDevice = {
  findByUser(userId) {
    return devices().filter({ user: userId }).value() || [];
  },

  findById(id) {
    return devices().find({ _id: id }).value() || null;
  },

  link({ user, deviceName, brand, model }) {
    const device = {
      _id: uuidv4(),
      user,
      deviceName: (deviceName || `${brand} ${model}`).trim(),
      brand,
      model,
      linkedAt: new Date().toISOString(),
      lastSyncAt: null,
      status: 'linked',
    };
    devices().push(device).write();
    return device;
  },

  unlink(id) {
    const dev = devices().find({ _id: id }).value();
    if (!dev) return null;
    devices().remove({ _id: id }).write();
    // Also remove vitals for this device
    vitals().remove({ deviceId: id }).write();
    return dev;
  },

  updateSyncTime(id) {
    const dev = devices().find({ _id: id });
    if (!dev.value()) return null;
    dev.assign({ lastSyncAt: new Date().toISOString() }).write();
    return dev.value();
  },
};

const SmartwatchVitals = {
  findByUser(userId, limit = 50) {
    return vitals()
      .filter({ user: userId })
      .value()
      .sort((a, b) => new Date(b.syncedAt) - new Date(a.syncedAt))
      .slice(0, limit);
  },

  findByDevice(deviceId, limit = 50) {
    return vitals()
      .filter({ deviceId })
      .value()
      .sort((a, b) => new Date(b.syncedAt) - new Date(a.syncedAt))
      .slice(0, limit);
  },

  getLatest(userId) {
    const all = vitals().filter({ user: userId }).value();
    if (all.length === 0) return null;
    return all.sort((a, b) => new Date(b.syncedAt) - new Date(a.syncedAt))[0];
  },

  sync({ user, deviceId, heartRate, spo2, steps, calories, sleep, stress, temperature }) {
    const entry = {
      _id: uuidv4(),
      user,
      deviceId,
      heartRate:   heartRate   != null ? Number(heartRate) : null,
      spo2:        spo2        != null ? Number(spo2) : null,
      steps:       steps       != null ? Number(steps) : null,
      calories:    calories    != null ? Number(calories) : null,
      sleep:       sleep       || null,   // { duration: '7h 20m', quality: 'good' }
      stress:      stress      != null ? Number(stress) : null,
      temperature: temperature != null ? Number(temperature) : null,
      syncedAt: new Date().toISOString(),
    };
    vitals().push(entry).write();

    // Update device last-sync time
    SmartwatchDevice.updateSyncTime(deviceId);

    return entry;
  },

  getSummary(userId, days = 7) {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const recent = vitals()
      .filter({ user: userId })
      .value()
      .filter((v) => v.syncedAt >= cutoff);

    if (recent.length === 0) {
      return { entries: 0, avgHeartRate: null, avgSpo2: null, totalSteps: 0, totalCalories: 0, avgStress: null };
    }

    const avg = (arr) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : null;

    const hrs    = recent.filter((v) => v.heartRate != null).map((v) => v.heartRate);
    const spo2s  = recent.filter((v) => v.spo2 != null).map((v) => v.spo2);
    const stress = recent.filter((v) => v.stress != null).map((v) => v.stress);

    return {
      entries: recent.length,
      avgHeartRate: avg(hrs),
      avgSpo2: avg(spo2s),
      totalSteps: recent.reduce((a, v) => a + (v.steps || 0), 0),
      totalCalories: recent.reduce((a, v) => a + (v.calories || 0), 0),
      avgStress: avg(stress),
      latestSync: recent[0] ? recent.sort((a, b) => new Date(b.syncedAt) - new Date(a.syncedAt))[0].syncedAt : null,
    };
  },
};

module.exports = { SmartwatchDevice, SmartwatchVitals, SUPPORTED_BRANDS };
