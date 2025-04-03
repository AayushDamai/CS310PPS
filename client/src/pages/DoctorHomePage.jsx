import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dochomepage.css';
import DoctorCalendar from '../components/DoctorCalendar';
import AddPrescriptions from '../components/AddPrescriptions';
import ExistingPrescriptions from '../components/ExistingPrescriptions';

const DoctorHomePage = () => {
    const navigate = useNavigate();
    const doctorId = localStorage.getItem('userId'); // Retrieve doctor_id from localStorage

    // State for tabs and functionality
    const [activeTab, setActiveTab] = useState('calendar'); // State to track the active tab
    const [prescriptionSubTab, setPrescriptionSubTab] = useState('add'); // Sub-tab for prescriptions
    const [messages, setMessages] = useState([]); // State to store messages
    const [newMessage, setNewMessage] = useState(''); // State to track new message input
    const [selectedPatientId, setSelectedPatientId] = useState(''); // State to track selected patient ID
    const [appointments, setAppointments] = useState([]); // State to store appointments
    const [selectedAppointment, setSelectedAppointment] = useState(null); // State to track selected appointment
    const [updatedAppointment, setUpdatedAppointment] = useState({}); // State for editing appointment

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

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch(`/api/appointments?doctorId=${doctorId}`);
                const data = await response.json();
                setAppointments(data); // Store appointments in state
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        if (activeTab === 'edit-appointments') {
            fetchAppointments();
        }
    }, [activeTab, doctorId]);

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

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setUpdatedAppointment({ ...updatedAppointment, [name]: value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/appointments/${selectedAppointment.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedAppointment),
            });

            if (response.ok) {
                alert('Appointment updated successfully!');
                setSelectedAppointment(null);
                setUpdatedAppointment({});
                setActiveTab('calendar'); // Redirect back to the calendar tab
            } else {
                alert('Failed to update appointment.');
            }
        } catch (error) {
            console.error('Error updating appointment:', error);
            alert('Error updating appointment.');
        }
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
                <button
                    className={activeTab === 'edit-appointments' ? 'active-link' : ''}
                    onClick={() => setActiveTab('edit-appointments')}
                >
                    Edit Appointments
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
                        <DoctorCalendar doctorId={doctorId} />
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
                {activeTab === 'edit-appointments' && (
                    <div className="dashboard-section">
                        <h2>Edit Appointments</h2>
                        <div>
                            <label>Select Appointment:</label>
                            <select
                                onChange={(e) =>
                                    setSelectedAppointment(
                                        appointments.find((appt) => appt.id === parseInt(e.target.value))
                                    )
                                }
                            >
                                <option value="">-- Select an Appointment --</option>
                                {appointments.map((appointment) => (
                                    <option key={appointment.id} value={appointment.id}>
                                        {appointment.patient_name} - {new Date(appointment.appointment_time).toLocaleString()}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {selectedAppointment && (
                            <form onSubmit={handleEditSubmit}>
                                <label>
                                    Appointment Date:
                                    <input
                                        type="text"
                                        name="appointment_date"
                                        placeholder="MM-DD-YYYY"
                                        value={updatedAppointment.appointment_date || ''}
                                        onChange={handleEditChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Appointment Time:
                                    <input
                                        type="text"
                                        name="appointment_time"
                                        placeholder="HH:MM AM/PM"
                                        value={updatedAppointment.appointment_time || ''}
                                        onChange={handleEditChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Status:
                                    <select
                                        name="status"
                                        value={updatedAppointment.status || ''}
                                        onChange={handleEditChange}
                                        required
                                    >
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </label>
                                <button type="submit">Update Appointment</button>
                            </form>
                        )}
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

