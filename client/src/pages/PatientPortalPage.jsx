// PatientPortalPage.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Ensure Link is imported
import NavBar from '../components/NavBar';
import NavPanel from '../components/NavPanel';
import '../styles/PatientPortal.css';

const PatientPortalPage = () => {
    return (
        <div className="patient-portal-page">
            <NavBar />
            <div className="portal-content">
                <NavPanel />
                <div className="main-section">
                    <h1 style={{ padding: 10 }}>Patient Portal</h1>
                    <Link to="/appointment-page">Appointments</Link> <br />
                    <Link to="/prescriptions">Prescriptions</Link> <br />
                    <Link to="/billing-page">Billing</Link>
                    <h1>Calendar will go here</h1>
                </div>
            </div>
        </div>
    );
};

export default PatientPortalPage;
