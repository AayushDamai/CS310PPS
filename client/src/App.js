/**
 * Root component - Main application layout
 * Contains route definitions and global state
 * Renders persistent UI elements (headers, footers)
 * Changed frequently as new features are added
*/

// React core imports
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ForgotInfoPage from './pages/ForgotInfoPage';

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/forgot-info" element={<ForgotInfoPage />} />
      </Routes>
    </div>
  );
}

export default App;
