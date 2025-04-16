import React, { useState, useEffect } from 'react';
import '../styles/MessagesPage.css';

const AdminMessagesPage = () => {
    const [activeTab, setActiveTab] = useState('new'); // State to track the active sub-tab
    const [newMessage, setNewMessage] = useState(''); // State for new message input
    const [recipientId, setRecipientId] = useState(''); // State for recipient ID
    const [messageHistory, setMessageHistory] = useState([]); // State to store all messages
    const [selectedMessages, setSelectedMessages] = useState([]); // State for messages with the selected recipient
    const [viewingMessages, setViewingMessages] = useState(false); // State to track if viewing messages

    // Fetch all messages for the admin
    const fetchMessageHistory = async () => {
        try {
            const response = await fetch('/api/admin/messages');
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

    // Handle selecting a recipient to view messages
    const handleRecipientClick = (recipientId) => {
        const recipientMessages = messageHistory.filter(
            (message) => message.recipient_id === recipientId || message.sent_by === recipientId
        );
        setSelectedMessages(recipientMessages);
        setRecipientId(recipientId);
        setViewingMessages(true); // Switch to message view
    };

    // Handle going back to the recipient list
    const handleBackClick = () => {
        setViewingMessages(false); // Switch back to the recipient list
        setSelectedMessages([]); // Clear selected messages
        setRecipientId(''); // Clear selected recipient ID
    };

    // Handle sending a message
    const sendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage || !recipientId) {
            alert('Please enter a message and recipient ID.');
            return;
        }

        try {
            const response = await fetch('/api/admin/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipientId,
                    message: newMessage,
                    sentBy: 'admin',
                }),
            });

            if (response.ok) {
                const newMessageObject = {
                    recipient_id: recipientId,
                    message: newMessage,
                    sent_by: 'admin',
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
            <h2>Admin Messaging System</h2>

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
                        <label>Recipient ID:</label>
                        <input
                            type="text"
                            value={recipientId}
                            onChange={(e) => setRecipientId(e.target.value)}
                            placeholder="Enter Recipient ID"
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
                        <div className="recipient-list">
                            <h4>Recipients</h4>
                            <ul>
                                {Array.from(
                                    new Set(
                                        messageHistory.map(
                                            (msg) => msg.recipient_id || msg.sent_by
                                        )
                                    )
                                ).map((recipientId) => (
                                    <li
                                        key={recipientId}
                                        onClick={() => handleRecipientClick(recipientId)}
                                        className="recipient-item"
                                    >
                                        Recipient ID: {recipientId}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="chat-box">
                            <button onClick={handleBackClick} className="back-button">
                                Back to Recipient List
                            </button>
                            <h4>Messages with Recipient ID: {recipientId}</h4>
                            <div className="messages">
                                {selectedMessages.length > 0 ? (
                                    selectedMessages.map((message, index) => (
                                        <div
                                            key={index}
                                            className={`message ${
                                                message.sent_by === 'admin'
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
                                    <p>No messages found for this recipient.</p>
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

export default AdminMessagesPage;