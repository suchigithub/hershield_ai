import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const notifRef = useRef(null);

  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    setNotifLoading(true);
    try {
      const { data } = await api.get('/hershanti/notifications');
      setNotifications(data.notifications || []);
    } catch {} finally { setNotifLoading(false); }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) loadNotifications();
  }, [isAuthenticated, loadNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    setNotifOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  const handleNotifAction = (n) => {
    setNotifOpen(false);
    if (n.action === 'meditate') navigate('/hershanti');
    else if (n.action === 'journal') navigate('/hershanti');
    else if (n.action === 'video') navigate('/hershanti');
    else if (n.action === 'therapist') navigate('/hershanti');
    else if (n.action === 'affirmation') { /* just close */ }
  };

  return (
    <nav className="nav-bar" style={{ background: 'linear-gradient(135deg, #ad1457 0%, #7b1fa2 50%, #6a1b9a 100%)', boxShadow: '0 2px 12px rgba(173,20,87,0.3)' }}>
      <Link to="/" className="nav-brand">
        🌸 HERSHIELD
      </Link>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
        {menuOpen ? '✕' : '☰'}
      </button>

      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {isAuthenticated ? (
          <>
            <span className="nav-greeting">Hi, {user?.name}</span>
            <Link to="/dashboard" className="nav-link" onClick={closeMenu}>Dashboard</Link>
            <Link to="/profile" className="nav-link" onClick={closeMenu}>Profile</Link>

            {/* Notification Bell */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen && notifications.length === 0) loadNotifications(); }}
                style={{ background: notifOpen ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: '8px', padding: '0.35rem 0.6rem', cursor: 'pointer', fontSize: '1.1rem', position: 'relative', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                aria-label="AI Notifications"
              >
                🔔
                {notifications.length > 0 && (
                  <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ff1744', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notifOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: '340px', maxHeight: '450px', overflowY: 'auto',
                  background: '#fff', borderRadius: '14px', boxShadow: '0 8px 32px rgba(106,27,154,0.2)', zIndex: 1000, border: '1px solid #e1bee7',
                }}>
                  <div style={{ padding: '0.8rem 1rem', borderBottom: '1px solid #f3e5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#6a1b9a', fontSize: '0.95rem' }}>🤖 AI Notifications</span>
                    <button onClick={loadNotifications} disabled={notifLoading}
                      style={{ background: 'none', border: '1px solid #e1bee7', color: '#6a1b9a', borderRadius: '6px', padding: '0.15rem 0.5rem', fontSize: '0.7rem', cursor: 'pointer' }}>
                      {notifLoading ? '⏳' : '🔄'} Refresh
                    </button>
                  </div>

                  {notifications.length === 0 && !notifLoading && (
                    <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#aaa' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔔</div>
                      <p style={{ fontSize: '0.85rem' }}>No notifications right now</p>
                    </div>
                  )}

                  {notifLoading && (
                    <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#aaa' }}>
                      <p style={{ fontSize: '0.85rem' }}>Loading...</p>
                    </div>
                  )}

                  {notifications.map((n, i) => (
                    <div key={i} onClick={() => handleNotifAction(n)}
                      style={{
                        padding: '0.7rem 1rem', borderBottom: '1px solid #fafafa', cursor: 'pointer',
                        transition: 'background 0.15s',
                        borderLeft: `3px solid ${n.type === 'mood-based' ? '#e91e63' : n.type === 'time-based' ? '#1565c0' : n.type === 'video-suggestion' ? '#c62828' : '#6a1b9a'}`,
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#faf5ff'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                    >
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{n.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                            <span style={{ fontWeight: 600, color: '#333', fontSize: '0.82rem' }}>{n.title}</span>
                            <span style={{
                              fontSize: '0.6rem', fontWeight: 600, padding: '0.1rem 0.35rem', borderRadius: '8px',
                              background: n.type === 'mood-based' ? '#fce4ec' : n.type === 'time-based' ? '#e3f2fd' : n.type === 'video-suggestion' ? '#fff3e0' : '#f3e5f5',
                              color: n.type === 'mood-based' ? '#c62828' : n.type === 'time-based' ? '#1565c0' : n.type === 'video-suggestion' ? '#e65100' : '#6a1b9a',
                            }}>
                              {n.type === 'mood-based' ? `🎯 ${n.mood}` : n.type === 'time-based' ? `🕐 ${n.timeOfDay}` : n.type === 'video-suggestion' ? '🎥 Video' : '🌟 Daily'}
                            </span>
                          </div>
                          <p style={{ color: '#666', fontSize: '0.78rem', lineHeight: 1.4, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {n.message}
                          </p>
                          {n.action && n.action !== 'affirmation' && (
                            <span style={{ display: 'inline-block', marginTop: '0.25rem', fontSize: '0.68rem', color: '#6a1b9a', fontWeight: 600 }}>
                              {n.action === 'meditate' ? '🧘 Go to Meditation →' : n.action === 'journal' ? '📝 Open Journal →' : n.action === 'video' ? '🎥 Watch Video →' : n.action === 'therapist' ? '👩‍⚕️ Find Therapist →' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div style={{ padding: '0.5rem 1rem', borderTop: '1px solid #f3e5f5', textAlign: 'center' }}>
                    <button onClick={() => { setNotifOpen(false); navigate('/hershanti'); }}
                      style={{ background: 'none', border: 'none', color: '#6a1b9a', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                      View All in HerShanti →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button onClick={handleLogout} className="nav-logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link" onClick={closeMenu}>Login</Link>
            <Link to="/register" className="nav-link" onClick={closeMenu}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
