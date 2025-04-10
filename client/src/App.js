import React from 'react';
import { AuthProvider } from './hooks/AuthContext';
import { Route, Routes } from 'react-router-dom';
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
import AddPrescriptionsPage from './pages/AddPrescriptionsPage';
import MessagesPage from './components/MessagesPage';
import AdminLogin from './components/AdminLogin';
import AdminPage from './pages/admin_dashboard';
import ViewDoctorAppointmentPage from './pages/ViewDoctorAppointmentPage'; // Import the missing component

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
          <Route path="/add-appointment-page" element={<AddAppointmentPage />} />
          <Route path="/prescriptions/:patient_id" element={<ViewPrescription />} />
          <Route path="/doctor-dashboard" element={<DoctorHomePage />} />
          <Route path="/doctor/add-prescription" element={<AddPrescriptionsPage />} />
          <Route path="/patient-portal" element={<ProtectedRoute> <PatientPortalPage /> </ProtectedRoute>} />
          <Route path="/appointment-page" element={<ProtectedRoute> <ViewAppointmentPage /> </ProtectedRoute>} />
          <Route path="/doctor-appointment-page" element={<ProtectedRoute> <ViewDoctorAppointmentPage /> </ProtectedRoute>} />
          <Route path="/doctor/messages" element={<MessagesPage doctorId={localStorage.getItem('userId')} />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<ProtectedRoute> <AdminPage /> </ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </div>
  );
};

export default App;