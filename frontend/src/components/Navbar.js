import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="nav-bar" style={{ background: 'linear-gradient(135deg, #6c63ff 0%, #3f3d94 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
      <Link to="/" className="nav-brand">
        🛡️ Hershild
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
