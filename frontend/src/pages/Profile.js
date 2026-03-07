import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const Profile = () => {
  const { user, refreshUser } = useAuth();

  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const { data } = await authService.updateProfile(form);
      setMessage(data.message || 'Profile updated.');
      await refreshUser();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleUpdate} style={styles.card}>
        <h2 style={styles.title}>Edit Profile</h2>

        {error && <div style={styles.error}>{error}</div>}
        {message && <div style={styles.success}>{message}</div>}

        <label style={styles.label}>Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Phone</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Email (read‑only)</label>
        <input value={user?.email || ''} disabled style={{ ...styles.input, opacity: 0.6 }} />

        <button type="submit" disabled={loading} style={styles.btn}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: '2rem 1rem',
    minHeight: 'calc(100vh - 60px)',
    background: '#f5f5ff',
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
    gap: '0.75rem',
  },
  title: { textAlign: 'center', color: '#333', marginBottom: '0.5rem' },
  label: { fontWeight: 600, fontSize: '0.85rem', color: '#555' },
  input: {
    padding: '0.75rem 1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
  },
  btn: {
    marginTop: '0.5rem',
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
  success: {
    background: '#e0ffe0',
    color: '#060',
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
  },
};

export default Profile;
