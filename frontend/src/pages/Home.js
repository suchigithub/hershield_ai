import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 60px)', background: 'linear-gradient(180deg, #f5f5ff 0%, #e8e6ff 100%)', padding: '1.5rem' }}>
    <div style={{ textAlign: 'center', maxWidth: '600px', width: '100%' }}>
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#6c63ff', marginBottom: '1rem' }}>🛡️ Hershild</h1>
      <p style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.15rem)', color: '#555', marginBottom: '2rem', lineHeight: 1.6 }}>
        A secure, full‑stack authentication platform built with React, Node.js, Express &amp; MongoDB.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <Link to="/register" style={{ padding: '0.75rem 1.75rem', background: '#6c63ff', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '1rem' }}>
          Get Started
        </Link>
        <Link to="/login" style={{ padding: '0.75rem 1.75rem', background: '#fff', color: '#6c63ff', border: '2px solid #6c63ff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '1rem' }}>
          Sign In
        </Link>
      </div>
      <div className="grid-2" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div className="card" style={{ fontSize: '0.9rem', color: '#444', textAlign: 'center' }}>🔐 JWT Access + Refresh Tokens</div>
        <div className="card" style={{ fontSize: '0.9rem', color: '#444', textAlign: 'center' }}>📧 Email / SMS OTP Verification</div>
        <div className="card" style={{ fontSize: '0.9rem', color: '#444', textAlign: 'center' }}>🛡️ Input Sanitization &amp; Rate Limiting</div>
        <div className="card" style={{ fontSize: '0.9rem', color: '#444', textAlign: 'center' }}>🔄 Refresh Token Rotation</div>
      </div>
    </div>
  </div>
);

export default Home;
