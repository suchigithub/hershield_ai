import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await register(form);
      // Redirect to OTP verification page with email (and dev OTP if available)
      navigate('/verify-otp', { state: { email: form.email, devOtp: data.devOtp || null } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Create your Hershild Account</h2>

        {error && <div style={styles.error}>{error}</div>}

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone (optional)"
          value={form.phone}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="password"
          type="password"
          placeholder="Password (min 8 chars, 1 uppercase, 1 number)"
          value={form.password}
          onChange={handleChange}
          required
          minLength={8}
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.btn}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p style={styles.footer}>
          Already have an account? <Link to="/login">Log in</Link>
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
    background: '#f5f5ff',
    padding: '1rem',
  },
  card: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 24px rgba(108,99,255,0.12)',
    width: '100%',
    maxWidth: '420px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  title: { textAlign: 'center', color: '#333', marginBottom: '0.5rem' },
  input: {
    padding: '0.75rem 1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
  },
  btn: {
    padding: '0.75rem',
    background: '#6c63ff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  error: {
    background: '#ffe0e0',
    color: '#c00',
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
  },
  footer: { textAlign: 'center', fontSize: '0.9rem', color: '#666' },
};

export default Register;
