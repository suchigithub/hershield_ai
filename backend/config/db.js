const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

// Ensure data directory exists
const fs = require('fs');
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const adapter = new FileSync(DB_PATH);
const db = low(adapter);

// Set defaults (runs only once if file is empty)
db.defaults({
  users: [],
  refreshTokens: [],
  savingsGoals: [],
  transactions: [],
  budgets: [],
  moodEntries: [],
  meditationLogs: [],
  supportGroups: [],
  groupMessages: [],
  periodLogs: [],
  teleconsultations: [],
  workoutLogs: [],
  workoutPlans: [],
  resumes: [],
  mentorConnections: [],
  communityPosts: [],
}).write();

const connectDB = async () => {
  console.log(`[HERSHIELD] JSON file DB ready at ${DB_PATH}`);
};

module.exports = { db, connectDB };
