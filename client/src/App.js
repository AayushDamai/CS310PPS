import React from 'react';
import { AuthProvider } from './hooks/AuthContext';
import { Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ForgotInfoPage from './pages/ForgotInfoPage';
import PatientPortalPage from './pages/PatientPortalPage';
import ContactUs from './pages/ContactUs';
import ViewAppointmentPage from './pages/ViewAppointmentPage';
import ProtectedRoute from './components/ProtectedRoute';
import AddAppointmentPage from './pages/AddAppointmentPage';
import ViewPrescription from './pages/ViewPrescription';
import DoctorHomePage from './pages/DoctorHomePage';
import AddPrescriptionsPage from './pages/AddPrescriptionsPage'


const App = () => {
  return (
    <div className="App">
     <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/forgot-info" element={<ForgotInfoPage />} />
        <Route path="/patient-appointment-page" element={<ViewAppointmentPage />} />
        <Route path="/add-appointment-page" element={<AddAppointmentPage/>} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/appointment-page" element={<ProtectedRoute> <ViewAppointmentPage /> </ProtectedRoute>} />
        <Route path="/prescriptions/:patient_id" element={<ViewPrescription />} />
        <Route path="/doctor-dashboard" element={<DoctorHomePage />} />
        <Route path="/doctor/add-prescription" element={<AddPrescriptionsPage/>} />
        <Route path="/patient-portal" element={<ProtectedRoute> <PatientPortalPage /> </ProtectedRoute>}/>

      </Routes>
   </AuthProvider>
    </div>
  );
};

export default App;