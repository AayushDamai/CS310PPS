// PatientPortalPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import NavBar from '../components/NavBar';

const PatientPortalPage = () => {
    // const userId = localStorage.getItem('userId'); //gets userId
    const { user } = useAuth(); //gets userId from AuthContext

    return (
        <div className="patient-portal-page">
            <NavBar />
            <h1 style={{ padding: 10 }}>Patient Portal</h1>
            <Link to="/appointment-page">Appointments</Link> <br />

            <Link to={`/prescriptions/${user.userId}`}>Prescriptions</Link> <br />
        </div>
    );
}

export default PatientPortalPage;