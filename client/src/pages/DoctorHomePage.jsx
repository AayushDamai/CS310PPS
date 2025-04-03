import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Portal.css';
import DoctorCalendar from '../components/DoctorCalendar';
import AddPrescriptions from '../components/AddPrescriptions';

const DoctorHomePage = () => {
    const navigate = useNavigate();
    const doctor_id = localStorage.getItem('userId'); // Retrieve doctor_id from localStorage

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
                <button
                    className="tab-button"
                    onClick={() => navigate('/doctor/add-prescription')}
                >
                    Add Prescription
                </button>
            </div>

            {/* Calendar Section */}
            <div className="calendar-section">
                <h2>Your Calendar</h2>
                <DoctorCalendar />
            </div>
        </div>
    );
};

export default DoctorHomePage;