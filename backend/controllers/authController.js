const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateOTP, sendOTP } = require('../services/otpService');
const {
  generateAccessToken,
  generateRefreshToken,
  revokeRefreshToken,
  revokeFamily,
  revokeAllUserTokens,
} = require('../utils/tokenUtils');
const RefreshToken = require('../models/RefreshToken');

// ─── Cookie options ───
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/api/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ────────────────────────────────────────────────
// POST /api/auth/register
// ────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existing = User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    // Generate OTP
    const otpCode = generateOTP();
    const otpExpiry = new Date(
      Date.now() + (Number(process.env.OTP_EXPIRY_MINUTES) || 10) * 60 * 1000
    ).toISOString();

    const user = await User.create({
      name,
      email,
      phone: phone || '',
      password,
      otp: { code: otpCode, expiresAt: otpExpiry },
    });

    // Send OTP (mock)
    await sendOTP({ email, phone, code: otpCode });

    const response = {
      message: 'Registration successful. Please verify your OTP.',
      userId: user._id,
    };

    // Include OTP in response (no real email/SMS provider configured)
    response.devOtp = otpCode;

    return res.status(201).json(response);
  } catch (err) {
    console.error('[Hershild] register error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ────────────────────────────────────────────────
// POST /api/auth/verify-otp
// ────────────────────────────────────────────────
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified.' });
    }

    if (!user.otp.code || user.otp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    if (new Date() > new Date(user.otp.expiresAt)) {
      return res.status(400).json({ message: 'OTP has expired.' });
    }

    user.isVerified = true;
    user.otp = { code: null, expiresAt: null };
    User.save(user);

    return res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    console.error('[Hershild] verifyOTP error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ────────────────────────────────────────────────
// POST /api/auth/resend-otp
// ────────────────────────────────────────────────
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.isVerified) return res.status(400).json({ message: 'Already verified.' });

    const otpCode = generateOTP();
    const otpExpiry = new Date(
      Date.now() + (Number(process.env.OTP_EXPIRY_MINUTES) || 10) * 60 * 1000
    ).toISOString();

    user.otp = { code: otpCode, expiresAt: otpExpiry };
    User.save(user);

    await sendOTP({ email, code: otpCode });

    const response = { message: 'OTP resent successfully.' };
    response.devOtp = otpCode;
    return res.json(response);
  } catch (err) {
    console.error('[Hershild] resendOTP error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ────────────────────────────────────────────────
// POST /api/auth/login
// ────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: 'Please verify your email before logging in.', code: 'NOT_VERIFIED' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

    return res.json({
      message: 'Login successful.',
      accessToken,
      user: User.sanitize(user),
    });
  } catch (err) {
    console.error('[Hershild] login error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ────────────────────────────────────────────────
// POST /api/auth/refresh
// ────────────────────────────────────────────────
exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token.' });

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch {
      return res.status(403).json({ message: 'Invalid refresh token.' });
    }

    // Look up the stored token
    const storedToken = RefreshToken.findOne({ token });

    if (!storedToken || storedToken.isRevoked) {
      // Possible reuse detected – revoke the whole family
      if (decoded.family) revokeFamily(decoded.family);
      res.clearCookie('refreshToken', { path: '/api/auth' });
      return res.status(403).json({ message: 'Refresh token reuse detected. Please log in again.' });
    }

    // Rotate: revoke old, issue new in same family
    revokeRefreshToken(token);

    const user = User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found.' });

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = await generateRefreshToken(user, decoded.family);

    res.cookie('refreshToken', newRefreshToken, REFRESH_COOKIE_OPTIONS);

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error('[Hershild] refreshToken error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ────────────────────────────────────────────────
// POST /api/auth/logout
// ────────────────────────────────────────────────
exports.logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      revokeRefreshToken(token);
    }
    res.clearCookie('refreshToken', { path: '/api/auth' });
    return res.json({ message: 'Logged out successfully.' });
  } catch (err) {
    console.error('[Hershild] logout error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ────────────────────────────────────────────────
// POST /api/auth/logout-all
// ────────────────────────────────────────────────
exports.logoutAll = async (req, res) => {
  try {
    revokeAllUserTokens(req.user.id);
    res.clearCookie('refreshToken', { path: '/api/auth' });
    return res.json({ message: 'All sessions revoked.' });
  } catch (err) {
    console.error('[Hershild] logoutAll error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
