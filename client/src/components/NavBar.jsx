import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = () => {
  const { pathname } = useLocation();

  // Page flags based on pathname
  const isLandingPage = pathname === '/';
  const isContactUs = pathname === '/contactUs';
  const isLogin = pathname === '/login';
  const isRegister = pathname === '/register';
  const isForgotInfo = pathname === '/forgot-info';
  const isPatientPortal = pathname === '/patient-portal';
  const isAppointmentPage = pathname === '/appointment-page';
  const isDoctorDashboard = pathname === '/doctor-dashboard';
  const isAddPrescriptionPage = pathname === '/doctor/add-prescription';
  const isPrescriptionPage = pathname.startsWith('/prescriptions');

  // Grouped flags for easier control over sections
  const showDefaultLogo = !(
    isPatientPortal ||
    isAppointmentPage ||
    isPrescriptionPage ||
    isDoctorDashboard ||
    isAddPrescriptionPage
  );
  const showPatientLogo = isPatientPortal || isAppointmentPage || isPrescriptionPage;
  const showDoctorLogo = isDoctorDashboard || isAddPrescriptionPage;

  // Show navigation links on landing and contact pages
  const showLandingNavLinks = isLandingPage || isContactUs;
  // Show logout on all protected pages
  const showLogout = (
    isPatientPortal ||
    isAppointmentPage ||
    isPrescriptionPage ||
    isDoctorDashboard ||
    isAddPrescriptionPage
  );

  // TODO: update this to use the AuthContext hook for more secure data sotrage and retrieval (see AuthContext.js)
  const handleLogout = () => {
    console.log('Before logout:', localStorage.getItem('userId')); // Debug log
    localStorage.removeItem('userId');
    window.location.href = '/login';
  };

  return (
    <div className="nav">
      {/* Logo rendering based on current page */}
      {showDefaultLogo && (
        <div className="logo">
          <Link to="/" className="logo">CS310PPS</Link>
        </div>
      )}
      {showPatientLogo && (
        <div className="logo">
          <Link to="/patient-portal" className="logo">Home</Link>
        </div>
      )}
      {showDoctorLogo && (
        <div className="logo">
          <Link to="/doctor-dashboard" className="logo">Home</Link>
        </div>
      )}

      {/* Navigation links for landing pages */}
      {showLandingNavLinks && (
        <div className="navlinks">
          <Link to="/contactUs">Contact Us</Link>
          <Link to="/register">Signup</Link>
          <Link to="/login">Login</Link>
        </div>
      )}

      {/* Logout link for protected pages */}
      {showLogout && (
        <div className="navlinks">
          <Link to="/" onClick={handleLogout}>Logout</Link>
        </div>
      )}
    </div>
  );
};

export default NavBar;
