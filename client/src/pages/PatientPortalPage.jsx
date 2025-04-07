// PatientPortalPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import NavPanel from '../components/NavPanel';
import '../styles/PatientPortal.css';
import '../styles/Dochomepage.css';
import PatientCalendar from '../components/PatientCalendar';
import ViewPrescriptions from '../components/ViewPrescriptions';
import MessagesPage from '../components/MessagesPage';
import LabTestResultsPage from '../components/LabTestResultsPage';

const PatientPortalPage = () => {
    const navigate = useNavigate();
    const patientId = localStorage.getItem('userId'); // Retrieve patient_id from localStorage

    // State for tabs and functionality
    const [activeTab, setActiveTab] = useState('calendar'); // State to track the active tab
    const [patientName, setPatientName] = useState('Patient'); // State to store the patient's name
    const [appointments, setAppointments] = useState([]); // State to store appointments

    // Fetch the patient's name when the component loads
    useEffect(() => {
        const fetchPatientName = async () => {
            try {
                const response = await fetch(`/api/patient-details?patientId=${patientId}`);
                const data = await response.json();
                if (response.ok) {
                    setPatientName(data.patientName); // Update the patient's name
                } else {
                    console.error('Failed to fetch patient name:', data.error);
                }
            } catch (error) {
                console.error('Error fetching patient name:', error);
            }
        };

        fetchPatientName();
    }, [patientId]);

    // Fetch appointments when the "Calendar" tab is active
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch(`/api/appointments?patientId=${patientId}`);
                const data = await response.json();
                setAppointments(data); // Store appointments in state
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        if (activeTab === 'calendar') {
            fetchAppointments();
        }
    }, [activeTab, patientId]);

    return (
        <div className="patient-dashboard">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="logo">Patient Portal</div>
                <button
                    className={activeTab === 'calendar' ? 'active-link' : ''}
                    onClick={() => setActiveTab('calendar')}
                >
                    Calendar
                </button>
                <button
                    className={activeTab === 'prescriptions' ? 'active-link' : ''}
                    onClick={() => setActiveTab('prescriptions')}
                >
                    Prescriptions
                </button>
                <button
                    className={activeTab === 'messages' ? 'active-link' : ''}
                    onClick={() => setActiveTab('messages')}
                >
                    Messages
                </button>
                <button
                    className={activeTab === 'lab-tests' ? 'active-link' : ''}
                    onClick={() => setActiveTab('lab-tests')}
                >
                    Lab Test Results
                </button>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="header">
                    <h1>Welcome, {patientName}</h1>
                    <div className="account">
                        <a href="/profile">Your Profile</a> | <a href="/logout">Log Out</a>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'calendar' && (
                    <div className="dashboard-section">
                        <h2>Your Appointments</h2>
                        <PatientCalendar patientId={patientId} />
                    </div>
                )}
                {activeTab === 'prescriptions' && (
                    <div className="dashboard-section">
                        <h2>Your Prescriptions</h2>
                        <ViewPrescriptions patientId={patientId} />
                    </div>
                )}
                {activeTab === 'messages' && (
                    <div className="dashboard-section">
                        <MessagesPage patientId={patientId} />
                    </div>
                )}
                {activeTab === 'lab-tests' && (
                    <div className="dashboard-section">
                        <LabTestResultsPage patientId={patientId} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientPortalPage;
