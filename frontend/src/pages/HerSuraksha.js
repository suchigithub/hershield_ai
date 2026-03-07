import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HerSuraksha = () => {
  const navigate = useNavigate();
  const [sosTriggered, setSosTriggered] = useState(false);
  const [location, setLocation] = useState(null);
  const [loadingLoc, setLoadingLoc] = useState(false);

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
