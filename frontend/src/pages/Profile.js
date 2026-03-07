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
    background: 'linear-gradient(180deg, #fce4ec 0%, #f3e5f5 100%)',
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
    gap: '0.75rem',
  },
  title: { textAlign: 'center', color: '#7b1fa2', marginBottom: '0.5rem' },
  label: { fontWeight: 600, fontSize: '0.85rem', color: '#ad1457' },
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
    background: 'linear-gradient(135deg, #ec407a 0%, #ab47bc 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(236,64,122,0.3)',
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
