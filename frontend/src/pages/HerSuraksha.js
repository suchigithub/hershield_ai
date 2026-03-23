import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const HerSuraksha = () => {
  const navigate = useNavigate();
  const [sosTriggered, setSosTriggered] = useState(false);
  const [location, setLocation] = useState(null);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [safetyTips, setSafetyTips] = useState([]);

  const loadTips = useCallback(async () => {
    try {
      const { data } = await api.get('/users/safety-tips/hersuraksha');
      if (data.data && data.data.tips) setSafetyTips(data.data.tips);
    } catch {}
  }, []);

  useEffect(() => { loadTips(); }, [loadTips]);

  const fetchLocation = () => {
    setLoadingLoc(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLoadingLoc(false);
        },
        () => {
          setLocation({ error: 'Location access denied' });
          setLoadingLoc(false);
        }
      );
    } else {
      setLocation({ error: 'Geolocation not supported' });
      setLoadingLoc(false);
    }
  };

  const handleSOS = () => {
    setSosTriggered(true);
    fetchLocation();
  };

  return (
    <div style={styles.wrapper}>
      <button onClick={() => navigate('/dashboard')} style={styles.back}>← Dashboard</button>
      <div style={styles.card}>
        <div style={styles.icon}>🛡️</div>
        <h2 style={styles.title}>HerSuraksha — Safety</h2>
        <p style={styles.desc}>
          Your personal safety companion. Trigger an SOS alert, share your live location, or call emergency services instantly.
        </p>

        <button onClick={handleSOS} style={styles.sosBtn}>
          🚨 SOS ALERT
        </button>

        {sosTriggered && (
          <div style={styles.alert}>
            <strong>⚠️ SOS Triggered!</strong>
            {loadingLoc && <p>Fetching your location...</p>}
            {location && !location.error && (
              <p>
                📍 Location: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}<br />
                <a
                  href={`https://maps.google.com/?q=${location.lat},${location.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#1a73e8' }}
                >
                  Open in Google Maps
                </a>
              </p>
            )}
            {location?.error && <p style={{ color: '#c00' }}>{location.error}</p>}
          </div>
        )}

        <div style={styles.quickActions}>
          <a href="tel:112" style={styles.actionBtn}>📞 Emergency Call</a>
          <button onClick={fetchLocation} style={styles.actionBtn}>📍 Share Location</button>
          <a href="sms:112" style={styles.actionBtn}>💬 Emergency SMS</a>
        </div>

        {location && !location.error && !sosTriggered && (
          <div style={styles.locBox}>
            📍 {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
          </div>
        )}
      </div>

      {/* AI Safety Tips */}
      {safetyTips.length > 0 && (
        <div style={{ maxWidth: '500px', margin: '1rem auto 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🤖</span>
            <h3 style={{ color: '#c62828', margin: 0, fontSize: '1rem' }}>AI Safety Tips for You</h3>
          </div>
          {safetyTips.map((tip) => (
            <div key={tip.id} style={{ background: '#fff', padding: '0.8rem 1rem', borderRadius: '10px', borderLeft: tip.priority === 'high' ? '4px solid #c62828' : '4px solid #f57f17', boxShadow: '0 2px 8px rgba(198,40,40,0.06)', marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                <strong style={{ color: '#c62828', fontSize: '0.9rem' }}>{tip.title}</strong>
                {tip.priority === 'high' && (
                  <span style={{ background: '#ffebee', color: '#c62828', padding: '0.1rem 0.4rem', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 600 }}>⚠️ HIGH</span>
                )}
              </div>
              <p style={{ color: '#555', fontSize: '0.85rem', lineHeight: 1.5, margin: '0.2rem 0' }}>{tip.tip}</p>
              <span style={{ display: 'inline-block', background: '#fce4ec', color: '#c62828', padding: '0.1rem 0.4rem', borderRadius: '8px', fontSize: '0.7rem' }}>#{tip.tag}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: { padding: '2rem 1rem', minHeight: 'calc(100vh - 60px)', background: '#fff5f5', maxWidth: '550px', margin: '0 auto' },
  back: { background: 'none', border: 'none', color: '#6c63ff', fontSize: '1rem', cursor: 'pointer', marginBottom: '1rem', fontWeight: 600 },
  card: { maxWidth: '500px', margin: '0 auto', background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 24px rgba(220,50,50,0.1)', textAlign: 'center' },
  icon: { fontSize: '3rem', marginBottom: '0.5rem' },
  title: { color: '#c62828', marginBottom: '0.5rem' },
  desc: { color: '#666', marginBottom: '1.5rem', lineHeight: 1.6 },
  sosBtn: { width: '100%', padding: '1rem', background: '#c62828', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1.3rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.1em', marginBottom: '1.5rem' },
  alert: { background: '#fff3e0', border: '1px solid #ffcc02', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', textAlign: 'left' },
  quickActions: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1rem' },
  actionBtn: { padding: '0.6rem 1rem', background: '#ffebee', color: '#c62828', border: '1px solid #ef9a9a', borderRadius: '8px', textDecoration: 'none', fontWeight: 500, cursor: 'pointer', fontSize: '0.9rem', flex: '1 1 auto', textAlign: 'center', minWidth: '120px' },
  locBox: { background: '#e8f5e9', padding: '0.75rem', borderRadius: '8px', color: '#2e7d32', fontSize: '0.9rem' },
};

export default HerSuraksha;
