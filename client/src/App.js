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
import PatientPortalPage from './pages/PatientPortalPage';
import ContactUs from './pages/ContactUs';
import ViewAppointmentPage from './pages/ViewAppointmentPage';



const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/forgot-info" element={<ForgotInfoPage />} />
        <Route path="/patient-portal" element={<PatientPortalPage />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/patient-appointment-page" element={<ViewAppointmentPage />} />
        <Route path="/add-appointment-page" element={<ViewAppointmentPage />} />
      </Routes>
    </div>
  );
}

export default App;
