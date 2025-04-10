import React, { useState, useEffect } from 'react';
import '../styles/MessagesPage.css';

const MessagesPagePatient = ({ patientId }) => {
    const [activeTab, setActiveTab] = useState('new'); // State to track the active sub-tab
    const [newMessage, setNewMessage] = useState(''); // State for new message input
    const [selectedDoctorId, setSelectedDoctorId] = useState(''); // State for selected doctor ID
    const [messageHistory, setMessageHistory] = useState([]); // State to store all messages

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
                    doctorId: selectedDoctorId,
                    patientId,
                    message: newMessage,
                    sentBy: 'patient',
                }),
            });

            if (response.ok) {
                setNewMessage(''); // Clear the input field
                alert('Message sent successfully!');
                if (activeTab === 'history') {
                    fetchMessageHistory(); // Refresh the message history
                }
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
                        <label>Select Doctor ID:</label>
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
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Message</th>
                                <th>Sent By</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(messageHistory) && messageHistory.length > 0 ? (
                                messageHistory.map((message, index) => (
                                    <tr key={index}>
                                        <td>{message.doctor_id}</td> {/* Ensure this key exists in the response */}
                                        <td>{message.message}</td>
                                        <td>{message.sent_by === 'patient' ? 'You' : 'Doctor'}</td>
                                        <td>{new Date(message.date).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No messages found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MessagesPagePatient;