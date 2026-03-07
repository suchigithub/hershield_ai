import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 60px)', background: 'linear-gradient(180deg, #fce4ec 0%, #f3e5f5 50%, #ede7f6 100%)', padding: '1.5rem' }}>
    <div style={{ textAlign: 'center', maxWidth: '600px', width: '100%' }}>
      <div style={{ fontSize: '1rem', color: '#ad1457', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>🎀 Happy Women's Day 2026</div>
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#7b1fa2', marginBottom: '0.5rem' }}>🌸 Hershild</h1>
      <p style={{ fontSize: '1rem', color: '#ad1457', fontWeight: 500, marginBottom: '0.75rem' }}>Empowering Women, Protecting Dreams</p>
      <p style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)', color: '#555', marginBottom: '2rem', lineHeight: 1.6 }}>
        A comprehensive platform for women's safety, health, finance, education, career, and rights — because every woman deserves to thrive.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <Link to="/register" style={{ padding: '0.75rem 1.75rem', background: 'linear-gradient(135deg, #ec407a 0%, #ab47bc 100%)', color: '#fff', borderRadius: '25px', textDecoration: 'none', fontWeight: 600, fontSize: '1rem', boxShadow: '0 4px 15px rgba(236,64,122,0.3)' }}>
          Get Started 🌸
        </Link>
        <Link to="/login" style={{ padding: '0.75rem 1.75rem', background: '#fff', color: '#ad1457', border: '2px solid #ec407a', borderRadius: '25px', textDecoration: 'none', fontWeight: 600, fontSize: '1rem' }}>
          Sign In
        </Link>
      </div>
      <div className="grid-2" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div className="card" style={{ fontSize: '0.9rem', color: '#7b1fa2', textAlign: 'center', background: 'rgba(255,255,255,0.9)', border: '1px solid #f8bbd0' }}>🛡️ Safety & SOS</div>
        <div className="card" style={{ fontSize: '0.9rem', color: '#7b1fa2', textAlign: 'center', background: 'rgba(255,255,255,0.9)', border: '1px solid #e1bee7' }}>❤️ Health & Wellness</div>
        <div className="card" style={{ fontSize: '0.9rem', color: '#7b1fa2', textAlign: 'center', background: 'rgba(255,255,255,0.9)', border: '1px solid #ce93d8' }}>💰 Finance & Career</div>
        <div className="card" style={{ fontSize: '0.9rem', color: '#7b1fa2', textAlign: 'center', background: 'rgba(255,255,255,0.9)', border: '1px solid #f48fb1' }}>🎓 Education & Rights</div>
      </div>
      <p style={{ marginTop: '2rem', color: '#ad1457', fontSize: '0.85rem', fontStyle: 'italic' }}>
        "Here's to strong women. May we know them. May we be them. May we raise them." 💜
      </p>
      {installPrompt && (
        <button onClick={handleInstall} style={{ marginTop: '1rem', padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #ec407a 0%, #ab47bc 100%)', color: '#fff', border: 'none', borderRadius: '25px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 15px rgba(236,64,122,0.3)' }}>
          📲 Install App
        </button>
      )}
    </div>
  </div>
  );
};

export default Home;
