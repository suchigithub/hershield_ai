import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const modules = [
  { name: 'HerSuraksha', icon: '🛡️', desc: 'Safety & SOS', path: '/hersuraksha', color: '#c62828', bg: '#ffebee' },
  { name: 'HerPaisa', icon: '💰', desc: 'Finance', path: '/herpaisa', color: '#1565c0', bg: '#e3f2fd' },
  { name: 'HerSwasthya', icon: '❤️', desc: 'Health', path: '/herswasthya', color: '#c62828', bg: '#fce4ec' },
  { name: 'HerShanti', icon: '🧘', desc: 'Mental Wellness', path: '/hershanti', color: '#6a1b9a', bg: '#f3e5f5' },
  { name: 'HerUdaan', icon: '🚀', desc: 'Career Restart', path: '/herudaan', color: '#e65100', bg: '#fff3e0' },
  { name: 'HerAdhikar', icon: '⚖️', desc: 'Govt. Schemes', path: '/heradhikar', color: '#2e7d32', bg: '#e8f5e9' },
  { name: 'HerShiksha', icon: '🎓', desc: 'Education', path: '/hershiksha', color: '#00838f', bg: '#e0f7fa' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="page-wrapper" style={{ background: '#f5f5ff' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Greeting banner */}
        <div className="hero-section" style={{ background: 'linear-gradient(135deg, #6c63ff 0%, #3f3d94 100%)', color: '#fff', marginBottom: '1.5rem' }}>
          <h2 style={{ marginBottom: '0.25rem', color: '#fff', fontSize: '1.5rem' }}>🛡️ Hershild Dashboard</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.05rem', margin: 0 }}>
            Welcome, <strong>{user?.name}</strong>!
          </p>
        </div>

        {/* Module grid */}
        <div className="dashboard-grid">
          {modules.map((m) => (
            <div
              key={m.name}
              className="module-card"
              onClick={() => navigate(m.path)}
              style={{ background: m.bg, borderColor: m.color + '33' }}
            >
              <div className="module-icon" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>{m.icon}</div>
              <div className="module-name" style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem', color: m.color }}>{m.name}</div>
              <div className="module-desc" style={{ fontSize: '0.8rem', color: '#777' }}>{m.desc}</div>
            </div>
          ))}
        </div>

        {/* User info */}
        <div className="card" style={{ boxShadow: '0 4px 24px rgba(108,99,255,0.12)' }}>
          <h3 style={{ marginBottom: '0.75rem', color: '#555' }}>Your Info</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={styles.infoCard}>
              <span style={styles.label}>Email</span>
              <span style={styles.value}>{user?.email}</span>
            </div>
            <div style={styles.infoCard}>
              <span style={styles.label}>Phone</span>
              <span style={styles.value}>{user?.phone || '—'}</span>
            </div>
            <div style={styles.infoCard}>
              <span style={styles.label}>Verified</span>
              <span style={styles.value}>{user?.isVerified ? '✅ Yes' : '❌ No'}</span>
            </div>
            <div style={styles.infoCard}>
              <span style={styles.label}>Member Since</span>
              <span style={styles.value}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    padding: '2rem',
    minHeight: 'calc(100vh - 64px)',
    background: '#f5f5ff',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  banner: {
    background: 'linear-gradient(135deg, #6c63ff 0%, #3f3d94 100%)',
    color: '#fff',
    padding: '2rem 2.5rem',
    borderRadius: '16px',
    marginBottom: '2rem',
  },
  title: { marginBottom: '0.25rem', color: '#fff', fontSize: '1.5rem' },
  welcome: { color: 'rgba(255,255,255,0.9)', fontSize: '1.05rem', margin: 0 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  moduleCard: {
    padding: '1.5rem 1rem',
    borderRadius: '14px',
    border: '1px solid',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.15s',
  },
  moduleIcon: { fontSize: '2.2rem', marginBottom: '0.5rem' },
  moduleName: { fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' },
  moduleDesc: { fontSize: '0.8rem', color: '#777' },
  card: {
    background: '#fff',
    padding: '1.5rem 2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 24px rgba(108,99,255,0.12)',
  },
  infoGrid: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  infoCard: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.6rem 1rem',
    background: '#f9f9ff',
    borderRadius: '8px',
    border: '1px solid #eee',
  },
  label: { fontWeight: 600, color: '#6c63ff' },
  value: { color: '#333' },
};

export default Dashboard;
