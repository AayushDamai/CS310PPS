import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Determine if we are on specific pages
  const isLogin = pathname === '/login';
  const isRegister = pathname === '/register';
  const isForgotInfo = pathname === '/forgot-info';
  const isPatientPortal = pathname === '/patient-portal';
  const isAppointmentPage = pathname === '/appointment-page';
  const isPrescriptionPage = pathname === '/prescriptions';

  // better logout. basically ensures that no userId is in localStorage when logging out
  const handleLogout = () => {
    console.log('Before logout:', localStorage.getItem('userId')); // Debugging log
    localStorage.removeItem('userId');
    window.location.href = '/login';

  };
  
  return (
    <nav className="nav">
      {!isPatientPortal && !isAppointmentPage && (
        <div className="logo">
          <Link to="/" className="logo">CS310PPS</Link>
        </div>
      )}
      {(isPatientPortal || isAppointmentPage) && (
        <div className="logo">
          <Link to="/patient-portal" className="logo">Home</Link>
        </div>
      )}
      {/* Only show these links if we are NOT on the login/signup page */}
      {!isLogin && !isRegister && !isForgotInfo && !isPatientPortal && !isAppointmentPage && (
        <div className="navlinks">
          <Link to="/contactUs">Contact Us</Link>
          <Link to="/register">Signup</Link>
          <Link to="/login">Login</Link>
        </div>
      )}
      {(isPatientPortal || isAppointmentPage || isPrescriptionPage) && (
        <div className="navlinks">
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;