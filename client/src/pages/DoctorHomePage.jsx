// src/pages/DoctorHomePage.jsx
import React, { useState, useEffect } from 'react';
import '../styles/Portal.css';
import DoctorCalendar from '../components/DoctorCalendar';

const DoctorHomePage = () => {
  const [activeTab, setActiveTab] = useState('calendar'); // State to track the active tab
  const [doctorData, setDoctorData] = useState(null); // State to store doctor data
  const [prescriptions, setPrescriptions] = useState([]); // State to store prescriptions
  const [patientId, setPatientId] = useState(''); // State to track the patient ID
  const [medication, setMedication] = useState(''); // State to track medication
  const [dosage, setDosage] = useState(''); // State to track dosage
  const [instructions, setInstructions] = useState(''); // State to track instructions
  const [messages, setMessages] = useState([]); // State to store messages
  const [newMessage, setNewMessage] = useState(''); // State to track new message input
  const [selectedPatientId, setSelectedPatientId] = useState(''); // State to track selected patient ID

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await fetch('/api/doctor'); // Replace with your API endpoint
        const data = await response.json();
        console.log('Fetched doctor data:', data);

        if (data && data.id) {
          setDoctorData(data); // Store doctor data in state
          localStorage.setItem('userId', data.id); // Store doctorId in localStorage
        } else {
          console.error('Doctor data is missing or invalid');
        }
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      }
    };

    fetchDoctorData();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/messages'); // Replace with your API endpoint
        const data = await response.json();
        console.log('Fetched messages:', data);
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (activeTab === 'messages') {
      fetchMessages();
    }
  }, [activeTab]);

  const handleAddPrescription = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId,
          doctorId: localStorage.getItem('userId'),
          medication,
          dosage,
          instructions,
        }),
      });

      if (response.ok) {
        const newPrescription = await response.json();
        setPrescriptions([...prescriptions, newPrescription]); // Add the new prescription to the list
        console.log('Prescription added:', newPrescription);
        // Clear the form
        setPatientId('');
        setMedication('');
        setDosage('');
        setInstructions('');
      } else {
        console.error('Failed to add prescription:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding prescription:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: selectedPatientId,
          doctorId: localStorage.getItem('userId'),
          message: newMessage,
        }),
      });

      if (response.ok) {
        const sentMessage = await response.json();
        setMessages([...messages, sentMessage]); // Add the new message to the list
        console.log('Message sent:', sentMessage);
        setNewMessage(''); // Clear the input field
        setSelectedPatientId(''); // Clear the patient ID field
      } else {
        console.error('Failed to send message:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="portal-container">
      <h1 className="portal-header">Doctor Portal</h1>
      <div className="tabs">
        <button
          className={activeTab === 'calendar' ? 'active-tab' : ''}
          onClick={() => setActiveTab('calendar')}
        >
          Calendar
        </button>
        <button
          className={activeTab === 'prescription' ? 'active-tab' : ''}
          onClick={() => setActiveTab('prescription')}
        >
          Prescription
        </button>
        <button
          className={activeTab === 'messages' ? 'active-tab' : ''}
          onClick={() => setActiveTab('messages')}
        >
          Messages
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 'calendar' && (
          <div className="calendar-section">
            <DoctorCalendar doctorId={localStorage.getItem('userId')} />
          </div>
        )}
        {activeTab === 'prescription' && (
          <div className="prescription-section">
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
          <div className="messages-section">
            <h2>Messages</h2>
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
                  <strong>Date:</strong> {new Date(message.date).toLocaleString()}
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

