import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ForgotInfoPage from './pages/ForgotInfoPage';
import PatientPortalPage from './pages/PatientPortalPage';
import ContactUs from './pages/ContactUs';
import ViewAppointmentPage from './pages/ViewAppointmentPage';
import ViewPrescription from './pages/ViewPrescription';
import BillingPage from './pages/BillingPage';
import DoctorHomePage from './pages/DoctorHomePage';
import AddPrescriptionsPage from './pages/AddPrescriptionsPage'


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
        <Route path="/appointment-page" element={<ViewAppointmentPage />} />
        <Route path="/prescriptions/:patient_id" element={<ViewPrescription />} />
        <Route path="/prescriptions" element={<Navigate to="/prescriptions/1" />} />
        <Route path="/doctor-dashboard" element={<DoctorHomePage />} />
        <Route path="/doctor/add-prescription" element={<AddPrescriptionsPage/>} />
        <Route path="/billing-page" element={<BillingPage />} />
        
      </Routes>
    </div>
  );
};

export default App;