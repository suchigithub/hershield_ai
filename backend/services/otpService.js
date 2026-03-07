/**
 * Mock OTP service for Hershild.
 * In production, replace with Twilio / SendGrid / AWS SES.
 */

const generateOTP = () => {
  // 6‑digit numeric OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * "Send" OTP – in dev mode we just log it to the console.
 * Returns the generated code so the caller can persist it.
 */
const sendOTP = async ({ email, phone, code }) => {
  // ── Mock implementation ──
  console.log('──────────────────────────────────────');
  console.log(`[Hershild OTP] Sending OTP to ${email || phone}`);
  console.log(`[Hershild OTP] Code: ${code}`);
  console.log('──────────────────────────────────────');

  // In production, integrate an email/SMS provider here.
  return { success: true };
};

module.exports = { generateOTP, sendOTP };
