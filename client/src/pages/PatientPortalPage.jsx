// PatientPortalPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

const PatientPortalPage = () => {
    return (
      <div className="patient-portal-page">
        <NavBar />
        <h1 style={{padding: 10}}>Patient Portal</h1>
        <Link to="/appointment-page">Appointments</Link> <br />
        <Link to="/prescriptions">Prescriptions</Link> <br />
        <Link to="/billing-page">Billing</Link>
        
      </div>
    );
}

export default PatientPortalPage;
