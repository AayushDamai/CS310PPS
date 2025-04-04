// PatientPortalPage.jsx
import React from 'react';
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
                    <h1>Calendar will go here</h1>
                </div>
            </div>
        </div>
    );
};

export default PatientPortalPage;
