require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/db');

// ── Route imports ──
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const herpaisaRoutes = require('./routes/herpaisa');
const hershantiRoutes = require('./routes/hershanti');
const herswasthyaRoutes = require('./routes/herswasthya');
const herudaanRoutes = require('./routes/herudaan');
const heradhikarRoutes = require('./routes/heradhikar');
const hershikshaRoutes = require('./routes/hershiksha');

const app = express();

// ── Security headers ──
app.use(helmet());

// ── CORS ──
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// ── Body parsers ──
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Cookie parser ──
app.use(cookieParser());

// ── Health check ──
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', app: 'HERSHIELD API', timestamp: new Date().toISOString() })
);

// ── API routes ──
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/herpaisa', herpaisaRoutes);
app.use('/api/hershanti', hershantiRoutes);
app.use('/api/herswasthya', herswasthyaRoutes);
app.use('/api/herudaan', herudaanRoutes);
app.use('/api/heradhikar', heradhikarRoutes);
app.use('/api/hershiksha', hershikshaRoutes);

// ── Serve React frontend in production ──
const frontendBuild = path.join(__dirname, '..', 'frontend', 'build');
app.use(express.static(frontendBuild));

// ── 404 for API routes ──
app.all('/api/*', (_req, res) => res.status(404).json({ message: 'Route not found.' }));

// ── SPA fallback — serve index.html for all non-API routes ──
app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendBuild, 'index.html'));
});

// ── Global error handler ──
app.use((err, _req, res, _next) => {
  console.error('[HERSHIELD] Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error.' });
});

// ── Start server ──
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[HERSHIELD] Server running on port ${PORT}`);
  });
});

module.exports = app;
