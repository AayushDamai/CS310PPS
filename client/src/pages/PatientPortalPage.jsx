// PatientPortalPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

const PatientPortalPage = () => {
    return (
      <div className="patient-portal-page">
        <NavBar />
        <h1>Patient Portal</h1>
        <Link to="/appointment-page">Appointments</Link>
      </div>
    );
}

export default PatientPortalPage;
