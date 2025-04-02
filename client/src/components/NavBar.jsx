// NavBar.js
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import '../styles/NavBar.css';

const NavBar = () => {
  const { pathname } = useLocation();
  const { logout } = useAuth(); // Import the logout function from AuthContext
  const navigate = useNavigate(); // Import the navigate function from react-router-dom

  // Determine if we are on an auth page (login/register)
  const isLogin = pathname === '/login';
  const isRegister = pathname === '/register';
  const isForgotInfo = pathname === '/forgot-info';
  const isPatientPortal = pathname === '/patient-portal';
  const isAppointmentPage = pathname === '/appointment-page';

  // Handler for logging out
  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate('/'); // Redirect to the landing page after logout
  };

  return (
    <nav className='nav'>
      {!isPatientPortal && !isAppointmentPage && (
        <div className="logo">
          <Link to="/" className="logo"> CS310PPS </Link>
        </div>
      )}
      {(isPatientPortal || isAppointmentPage) && (
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
          <Link to="/" onClick={handleLogout}>Logout</Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
