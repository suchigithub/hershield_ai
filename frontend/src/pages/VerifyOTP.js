import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const VerifyOTP = () => {
  const { verifyOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const emailFromState = location.state?.email || '';
  const devOtpFromState = location.state?.devOtp || null;

  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState(devOtpFromState);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const data = await verifyOTP({ email, otp });
      setMessage(data.message || 'Verified! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setMessage('');
    try {
      const { data } = await authService.resendOTP(email);
      if (data.devOtp) setDevOtp(data.devOtp);
      setMessage(data.message || 'OTP resent. Check your email/phone.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not resend OTP.');
    }
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleVerify} style={styles.card}>
        <h2 style={styles.title}>Verify OTP 💜</h2>
        <p style={styles.sub}>
          Enter the 6‑digit code sent to your email/phone.
        </p>

        {devOtp && (
          <div style={styles.devBanner}>
            <strong>DEV MODE</strong> — Your OTP is: <code style={{ fontSize: '1.3rem', letterSpacing: '0.2em' }}>{devOtp}</code>
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}
        {message && <div style={styles.success}>{message}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="6‑digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          maxLength={6}
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.btn}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>

        <button type="button" onClick={handleResend} style={styles.resendBtn}>
          Resend OTP
        </button>

        <p style={styles.footer}>
          <Link to="/login">Back to Login</Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 60px)',
    background: 'linear-gradient(180deg, #fce4ec 0%, #f3e5f5 100%)',
    padding: '1rem',
  },
  card: {
    background: 'rgba(255,255,255,0.95)',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(173,20,87,0.12)',
    border: '1px solid #f8bbd0',
    width: '100%',
    maxWidth: '420px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  title: { textAlign: 'center', color: '#7b1fa2' },
  sub: { textAlign: 'center', color: '#777', fontSize: '0.9rem' },
  input: {
    padding: '0.75rem 1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    textAlign: 'center',
    letterSpacing: '0.3em',
  },
  btn: {
    padding: '0.75rem',
    background: 'linear-gradient(135deg, #ec407a 0%, #ab47bc 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(236,64,122,0.3)',
  },
  resendBtn: {
    padding: '0.6rem',
    background: 'transparent',
    color: '#ad1457',
    border: '1px solid #ec407a',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 500,
  },
  error: {
    background: '#ffe0e0',
    color: '#c00',
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
  },
  success: {
    background: '#e0ffe0',
    color: '#060',
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
  },
  footer: { textAlign: 'center', fontSize: '0.9rem', color: '#666' },
  devBanner: {
    background: '#fff8e1',
    border: '1px solid #ffe082',
    color: '#6d4c00',
    padding: '0.8rem 1rem',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '0.95rem',
    lineHeight: 1.6,
  },
};

export default VerifyOTP;
