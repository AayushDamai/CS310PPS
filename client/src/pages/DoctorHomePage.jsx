import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dochomepage.css';
import DoctorCalendar from '../components/DoctorCalendar';
import AddPrescriptions from '../components/AddPrescriptions';
import ExistingPrescriptions from '../components/ExistingPrescriptions';

const DoctorHomePage = () => {
    const navigate = useNavigate();
    const doctor_id = localStorage.getItem('userId'); // Retrieve doctor_id from localStorage

    // State for tabs and functionality
    const [activeTab, setActiveTab] = useState('calendar'); // State to track the active tab
    const [prescriptionSubTab, setPrescriptionSubTab] = useState('add'); // Sub-tab for prescriptions
    const [messages, setMessages] = useState([]); // State to store messages
    const [newMessage, setNewMessage] = useState(''); // State to track new message input
    const [selectedPatientId, setSelectedPatientId] = useState(''); // State to track selected patient ID

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch('/api/messages');
                const data = await response.json();
                setMessages(data); // Store messages in state
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        if (activeTab === 'messages') {
            fetchMessages();
        }
    }, [activeTab]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        const newMessageObj = {
            patientId: selectedPatientId,
            message: newMessage,
            sentBy: 'doctor',
            date: new Date().toLocaleString(),
        };
        setMessages([...messages, newMessageObj]);
        setSelectedPatientId('');
        setNewMessage('');
    };

    return (
        <div className="doctor-dashboard">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="logo">Doctor Dashboard</div>
                <button
                    className={activeTab === 'calendar' ? 'active-link' : ''}
                    onClick={() => setActiveTab('calendar')}
                >
                    Calendar
                </button>
                <button
                    className={activeTab === 'prescription' ? 'active-link' : ''}
                    onClick={() => setActiveTab('prescription')}
                >
                    Add Prescription
                </button>
                <button
                    className={activeTab === 'messages' ? 'active-link' : ''}
                    onClick={() => setActiveTab('messages')}
                >
                    Message Patients
                </button>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="header">
                    <h1>Welcome, Doctor</h1>
                    <div className="account">
                        <a href="/profile">Your Profile</a> | <a href="/logout">Log Out</a>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'calendar' && (
                    <div className="dashboard-section">
                        <h2>Upcoming Appointments</h2>
                        <DoctorCalendar doctorId={doctor_id} />
                    </div>
                )}
                {activeTab === 'prescription' && (
                    <div className="dashboard-section">
                        <div className="sub-tabs">
                            <button
                                className={prescriptionSubTab === 'add' ? 'active-link' : ''}
                                onClick={() => setPrescriptionSubTab('add')}
                            >
                                Add Prescription
                            </button>
                            <button
                                className={prescriptionSubTab === 'existing' ? 'active-link' : ''}
                                onClick={() => setPrescriptionSubTab('existing')}
                            >
                                Existing Prescriptions
                            </button>
                        </div>

                        {prescriptionSubTab === 'add' && <AddPrescriptions />}
                        {prescriptionSubTab === 'existing' && <ExistingPrescriptions />}
                    </div>
                )}
                {activeTab === 'messages' && (
                    <div className="dashboard-section">
                        <h2>Message Patients</h2>
                        <form className="message-form" onSubmit={handleSendMessage}>
                            <div className="form-group">
                                <label>Patient ID:</label>
                                <input
                                    type="text"
                                    value={selectedPatientId}
                                    onChange={(e) => setSelectedPatientId(e.target.value)}
                                    placeholder="Enter Patient ID"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Message:</label>
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Enter your message"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-submit">
                                Send Message
                            </button>
                        </form>
                        <h3>Message History</h3>
                        <ul className="message-list">
                            {messages.map((message, index) => (
                                <li key={index} className="message-item">
                                    <strong>Patient ID:</strong> {message.patientId} <br />
                                    <strong>Message:</strong> {message.message} <br />
                                    <strong>Sent By:</strong> {message.sentBy} <br />
                                    <strong>Date:</strong> {message.date}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
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

