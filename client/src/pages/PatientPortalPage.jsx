// PatientPortalPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

const PatientPortalPage = () => {
    const userId = localStorage.getItem('userId'); //gets userId
    
    if (!userId) {
        return (
            <div className="patient-portal-page">
                <NavBar />
                <h1 style={{padding: '10px'}}>Patient Portal</h1>
                <p>Please log in to access patient features.</p>
            </div>
        );
    }

    return (
        <div className="patient-portal-page">
            <NavBar />
            <h1 style={{padding: '10px'}}>Patient Portal</h1>
            <Link to="/appointment-page" style={{display: 'block', margin: '10px 0'}}>
                Appointments
            </Link>
            <Link to={`/prescriptions/${userId}`} style={{display: 'block', margin: '10px 0'}}>
                Prescriptions
            </Link>
        </div>
    );
}

export default PatientPortalPage;