// src/pages/DoctorHomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Portal.css';
import DoctorCalendar from '../components/DoctorCalendar';

const DoctorHomePage = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate

  return (
    <div className="portal-container">
      <h1>Welcome to the Doctor Portal</h1>

      {/* Tabs Navigation */}
      <div className="tabs">
        <button
          className="tab-button"
          onClick={() => navigate('/doctor/appointments')}
        >
          Appointments
        </button>
      </div>

      {/* Calendar Section */}
      <div className="calendar-section">
        <h2>Your Calendar</h2>
        <DoctorCalendar /> {/* Render the DoctorCalendar component */}
      </div>
    </div>
  );
};

export default DoctorHomePage;

// filepath: c:\Users\ethan\OneDrive\Documents\CS310pps\CS310PPS\client\src\App.js

const App = () => {
  return (
    <div className="App">
      <Routes>
        {/* Other routes */}
        <Route path="/doctor/messages" element={<MessagesPage />} /> {/* Messages Page */}
      </Routes>
    </div>
  );
};