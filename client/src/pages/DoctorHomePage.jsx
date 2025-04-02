// src/pages/DoctorHomePage.jsx
import React, { useState, useEffect } from 'react';
import '../styles/Portal.css';
import DoctorCalendar from '../components/DoctorCalendar';

const DoctorHomePage = () => {
  const [activeTab, setActiveTab] = useState('calendar'); // State to track the active tab
  const [prescriptions, setPrescriptions] = useState([]); // State to store prescriptions
  const [patientId, setPatientId] = useState(''); // State to track the patient ID
  const [medication, setMedication] = useState(''); // State to track medication
  const [dosage, setDosage] = useState(''); // State to track dosage
  const [instructions, setInstructions] = useState(''); // State to track instructions
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

  const handleAddPrescription = (e) => {
    e.preventDefault();
    const newPrescription = {
      patientId,
      medication,
      dosage,
      instructions,
    };
    setPrescriptions([...prescriptions, newPrescription]);
    setPatientId('');
    setMedication('');
    setDosage('');
    setInstructions('');
  };

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
          Manage Prescriptions
        </button>
        <button
          className={activeTab === 'messages' ? 'active-link' : ''}
          onClick={() => setActiveTab('messages')}
        >
          Message Patients
        </button>
        <button
          className={activeTab === 'profile' ? 'active-link' : ''}
          onClick={() => setActiveTab('profile')}
        >
          Profile
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
            <DoctorCalendar doctorId={localStorage.getItem('userId')} />
          </div>
        )}
        {activeTab === 'prescription' && (
          <div className="dashboard-section">
            <h2>Manage Prescriptions</h2>
            <form className="prescription-form" onSubmit={handleAddPrescription}>
              <div className="form-group">
                <label>Patient ID:</label>
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="Enter Patient ID"
                  required
                />
              </div>
              <div className="form-group">
                <label>Medication:</label>
                <input
                  type="text"
                  value={medication}
                  onChange={(e) => setMedication(e.target.value)}
                  placeholder="Enter Medication Name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Dosage:</label>
                <input
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="Enter Dosage"
                  required
                />
              </div>
              <div className="form-group">
                <label>Instructions:</label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Enter Instructions"
                  required
                />
              </div>
              <button type="submit" className="btn-submit">
                Add Prescription
              </button>
            </form>
            <h3>Existing Prescriptions</h3>
            <ul className="prescription-list">
              {prescriptions.map((prescription, index) => (
                <li key={index} className="prescription-item">
                  <strong>Patient ID:</strong> {prescription.patientId} <br />
                  <strong>Medication:</strong> {prescription.medication} <br />
                  <strong>Dosage:</strong> {prescription.dosage} <br />
                  <strong>Instructions:</strong> {prescription.instructions}
                </li>
              ))}
            </ul>
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
        {activeTab === 'profile' && (
          <div className="dashboard-section">
            <h2>Doctor Profile</h2>
            <p>Here you can view and update your profile information.</p>
            <ul>
              <li><strong>Name:</strong> Dr. John Doe</li>
              <li><strong>Email:</strong> doctor@example.com</li>
              <li><strong>Specialization:</strong> Cardiology</li>
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

