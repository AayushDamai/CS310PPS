import React, { useState, useEffect } from 'react';
import '../styles/MessagesPage.css';

const MessagesPagePatient = ({ patientId }) => {
    const [activeTab, setActiveTab] = useState('new'); // State to track the active sub-tab
    const [newMessage, setNewMessage] = useState(''); // State for new message input
    const [selectedDoctorId, setSelectedDoctorId] = useState(''); // State for selected doctor ID
    const [messageHistory, setMessageHistory] = useState([]); // State to store all messages
    const [selectedMessages, setSelectedMessages] = useState([]); // State for messages of the selected doctor
    const [viewingMessages, setViewingMessages] = useState(false); // State to track if viewing messages

    // Fetch all messages for the patient
    const fetchMessageHistory = async () => {
        try {
            const response = await fetch(`/api/messages?patientId=${patientId}`);
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

    // Handle selecting a doctor to view messages
    const handleDoctorClick = (doctorId) => {
        const doctorMessages = messageHistory.filter(
            (message) => message.doctor_id === doctorId
        );
        setSelectedMessages(doctorMessages);
        setSelectedDoctorId(doctorId);
        setViewingMessages(true); // Switch to message view
    };

    // Handle going back to the doctor list
    const handleBackClick = () => {
        setViewingMessages(false); // Switch back to the doctor list
        setSelectedMessages([]); // Clear selected messages
        setSelectedDoctorId(''); // Clear selected doctor ID
    };

    // Handle sending a message
    const sendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage || !selectedDoctorId) {
            alert('Please enter a message and select a doctor.');
            return;
        }

        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId,
                    doctorId: selectedDoctorId,
                    message: newMessage,
                    sentBy: 'patient',
                }),
            });

            if (response.ok) {
                const newMessageObject = {
                    doctor_id: selectedDoctorId,
                    message: newMessage,
                    sent_by: 'patient',
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
                            value={selectedDoctorId}
                            onChange={(e) => setSelectedDoctorId(e.target.value)}
                            placeholder="Enter Doctor ID"
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
                        <div className="doctor-list">
                            <h4>Doctors</h4>
                            <ul>
                                {Array.from(
                                    new Set(messageHistory.map((msg) => msg.doctor_id))
                                ).map((doctorId) => (
                                    <li
                                        key={doctorId}
                                        onClick={() => handleDoctorClick(doctorId)}
                                        className="doctor-item"
                                    >
                                        Doctor ID: {doctorId}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="chat-box">
                            <button onClick={handleBackClick} className="back-button">
                                Back to Doctor List
                            </button>
                            <h4>Messages with Doctor ID: {selectedDoctorId}</h4>
                            <div className="messages">
                                {selectedMessages.length > 0 ? (
                                    selectedMessages.map((message, index) => (
                                        <div
                                            key={index}
                                            className={`message ${
                                                message.sent_by === 'patient'
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
                                    <p>No messages found for this doctor.</p>
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

export default MessagesPagePatient;