import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import HerSuraksha from './pages/HerSuraksha';
import HerPaisa from './pages/HerPaisa';
import HerSwasthya from './pages/HerSwasthya';
import HerShanti from './pages/HerShanti';
import HerUdaan from './pages/HerUdaan';
import HerAdhikar from './pages/HerAdhikar';
import HerShiksha from './pages/HerShiksha';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hersuraksha"
            element={
              <ProtectedRoute>
                <HerSuraksha />
              </ProtectedRoute>
            }
          />
          <Route
            path="/herpaisa"
            element={
              <ProtectedRoute>
                <HerPaisa />
              </ProtectedRoute>
            }
          />
          <Route
            path="/herswasthya"
            element={
              <ProtectedRoute>
                <HerSwasthya />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hershanti"
            element={
              <ProtectedRoute>
                <HerShanti />
              </ProtectedRoute>
            }
          />
          <Route
            path="/herudaan"
            element={
              <ProtectedRoute>
                <HerUdaan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/heradhikar"
            element={
              <ProtectedRoute>
                <HerAdhikar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hershiksha"
            element={
              <ProtectedRoute>
                <HerShiksha />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
