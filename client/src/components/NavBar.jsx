// NavBar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = () => {
  const { pathname } = useLocation();

  // Determine if we are on an auth page (login/register)
  const isLogin = pathname === '/login';
  const isRegister = pathname === '/register';
  const isForgotInfo = pathname === '/forgot-info';
  const isPatientPortal = pathname === '/patient-portal';
  const isAppointmentPage = pathname === '/appointment-page';

  return (
    <nav className='nav'>
      {!isPatientPortal && !isAppointmentPage && (
        <div className="logo">
          <Link to="/" className="logo"> CS310PPS </Link>
        </div>
      )}
      {(isPatientPortal || isAppointmentPage ) && (
        <div className="logo">
          <Link to="/patient-portal" className="logo"> Home </Link>
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
      {(isPatientPortal || isAppointmentPage) && (
        <div className="navlinks">
          <Link to="/">Logout</Link>
        </div>
      )}

    </nav>
  );
};

export default NavBar;
