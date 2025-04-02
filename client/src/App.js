/**
 * Root component - Main application layout
 * Contains route definitions and global state
 * Renders persistent UI elements (headers, footers)
 * Changed frequently as new features are added
*/

// React core imports
import React from 'react';
import { Route, Routes, Router } from 'react-router-dom';
import { AuthProvider } from './hooks/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ForgotInfoPage from './pages/ForgotInfoPage';
import PatientPortalPage from './pages/PatientPortalPage';
import ContactUs from './pages/ContactUs';
import ViewAppointmentPage from './pages/ViewAppointmentPage';
import ProtectedRoute from './components/ProtectedRoute';



const App = () => {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/forgot-info" element={<ForgotInfoPage />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/patient-portal" element={<ProtectedRoute> <PatientPortalPage /> </ProtectedRoute>}/>
          <Route path="/appointment-page" element={<ProtectedRoute> <ViewAppointmentPage /> </ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
