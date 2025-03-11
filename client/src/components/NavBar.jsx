// NavBar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = () => {
  const { pathname } = useLocation();

  // Determine if we are on an auth page (login/register)
  const isLandingPage = pathname === '/';

  return (
    <nav className='nav'>
      <div className="logo">
        <Link to="/" className="logo"> CS310PPS </Link>
      </div>
      {/* Only show these links if we are NOT on the login/signup page */}
      {isLandingPage && (
        <div className="navlinks">
          <Link to="/contactUs">Contact Us</Link>
          <Link to="/register">Signup</Link>
          <Link to="/login">Login</Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
