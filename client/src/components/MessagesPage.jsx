// filepath: c:\Users\ethan\OneDrive\Documents\310\client\src\pages\MessagesPage.jsx
import React, { useState, useEffect } from 'react';
import '../styles/MessagesPage.css';

const MessagesPage = ({ doctorId }) => {
    const [activeTab, setActiveTab] = useState('new'); // State to track the active sub-tab
    const [newMessage, setNewMessage] = useState(''); // State for new message input
    const [selectedPatientId, setSelectedPatientId] = useState(''); // State for selected patient ID
    const [messageHistory, setMessageHistory] = useState([]); // State to store all messages
    const [selectedMessages, setSelectedMessages] = useState([]); // State for messages of the selected patient
    const [viewingMessages, setViewingMessages] = useState(false); // State to track if viewing messages

    // Fetch all messages for the doctor
    const fetchMessageHistory = async () => {
        try {
            const response = await fetch(`/api/messages?doctorId=${doctorId}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setMessageHistory(data); // Set the state only if the response is an array
            } else {
                console.error('Unexpected response format:', data);
                setMessageHistory([]); // Fallback to an empty array
            }
        } catch (error) {
            console.error('Error fetching message history:', error);
            setMessageHistory([]); // Fallback to an empty array in case of an error
        }
    };

    // Fetch message history when the component loads
    useEffect(() => {
        if (activeTab === 'history') {
            fetchMessageHistory();
        }
    }, [activeTab]);

    // Handle selecting a patient to view messages
    const handlePatientClick = (patientId) => {
        const patientMessages = messageHistory.filter(
            (message) => message.patient_id === patientId
        );
        setSelectedMessages(patientMessages);
        setSelectedPatientId(patientId);
        setViewingMessages(true); // Switch to message view
    };

    // Handle going back to the patient list
    const handleBackClick = () => {
        setViewingMessages(false); // Switch back to the patient list
    };

    // Handle sending a message
    const sendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage || !selectedPatientId) {
            alert('Please enter a message and select a patient.');
            return;
        }

        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    doctorId,
                    patientId: selectedPatientId,
                    message: newMessage,
                    sentBy: 'doctor',
                }),
            });

            if (response.ok) {
                const newMessageObject = {
                    patient_id: selectedPatientId,
                    message: newMessage,
                    sent_by: 'doctor',
                    date: new Date().toISOString(),
                };
                setSelectedMessages((prevMessages) => [...prevMessages, newMessageObject]);
                setMessageHistory((prevHistory) => [...prevHistory, newMessageObject]);
                setNewMessage(''); // Clear the input field
            } else {
                console.error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="messages-page">
            <h2>Messaging System</h2>

            {/* Sub-tabs for New Message and Message History */}
            <div className="sub-tabs">
                <button
                    className={activeTab === 'new' ? 'active-link' : ''}
                    onClick={() => setActiveTab('new')}
                >
                    New Message
                </button>
                <button
                    className={activeTab === 'history' ? 'active-link' : ''}
                    onClick={() => setActiveTab('history')}
                >
                    Message History
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'new' && (
                <div className="new-message">
                    <h3>Send a New Message</h3>
                    <div>
                        <label>ID:</label>
                        <input
                            type="text"
                            value={selectedPatientId}
                            onChange={(e) => setSelectedPatientId(e.target.value)}
                            placeholder="Enter Patient ID"
                        />
                    </div>
                    <form onSubmit={sendMessage}>
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message here..."
                            required
                        />
                        <button type="submit">Send Message</button>
                    </form>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="message-history">
                    <h3>Message History</h3>
                    {!viewingMessages ? (
                        <div className="patient-list">
                            <h4>Patients</h4>
                            <ul>
                                {Array.from(
                                    new Set(messageHistory.map((msg) => msg.patient_id))
                                ).map((patientId) => (
                                    <li
                                        key={patientId}
                                        onClick={() => handlePatientClick(patientId)}
                                        className="patient-item"
                                    >
                                        Patient ID: {patientId}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="chat-box">
                            <button onClick={handleBackClick} className="back-button">
                                Back to Patient List
                            </button>
                            <h4>Messages with Patient ID: {selectedPatientId}</h4>
                            <div className="messages">
                                {selectedMessages.length > 0 ? (
                                    selectedMessages.map((message, index) => (
                                        <div
                                            key={index}
                                            className={`message ${
                                                message.sent_by === 'doctor'
                                                    ? 'sent'
                                                    : 'received'
                                            }`}
                                        >
                                            <p>{message.message}</p>
                                            <span className="timestamp">
                                                {new Date(message.date).toLocaleString()}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p>No messages found for this patient.</p>
                                )}
                            </div>
                            <form onSubmit={sendMessage} className="message-input-form">
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message here..."
                                    required
                                />
                                <button type="submit">Send</button>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MessagesPage;