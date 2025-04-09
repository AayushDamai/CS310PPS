import React, { useState, useEffect } from 'react';

const ManageMessages = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState({
        doctorId: '',
        patientId: '',
        content: '',
        sentBy: 'admin', // Default sender is admin
    });

    // Fetch messages when the component loads
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch('/api/messages');
                const data = await response.json();
                console.log('Messages API Response:', data); // Debugging
                setMessages(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, []);

    // Handle sending a new message
    const handleSendMessage = async () => {
        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMessage),
            });
            if (response.ok) {
                const sentMessage = await response.json();
                setMessages([...messages, sentMessage]);
                setNewMessage({ doctorId: '', patientId: '', content: '', sentBy: 'admin' });
            } else {
                console.error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Handle deleting a message
    const handleDeleteMessage = async (id) => {
        try {
            const response = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setMessages(messages.filter((message) => message.id !== id));
            } else {
                console.error('Failed to delete message');
            }
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    return (
        <div>
            <h2>Manage Messages</h2>

            {/* Send Message Form */}
            <div>
                <h3>Send New Message</h3>
                <input
                    type="text"
                    placeholder="Doctor ID"
                    value={newMessage.doctorId}
                    onChange={(e) => setNewMessage({ ...newMessage, doctorId: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Patient ID"
                    value={newMessage.patientId}
                    onChange={(e) => setNewMessage({ ...newMessage, patientId: e.target.value })}
                />
                <textarea
                    placeholder="Message Content"
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                />
                <button onClick={handleSendMessage}>Send Message</button>
            </div>

            {/* Messages List */}
            <div>
                <h3>Messages List</h3>
                <ul>
                    {Array.isArray(messages) ? (
                        messages.map((message) => (
                            <li key={message.id}>
                                <strong>Doctor ID:</strong> {message.doctorId}, <strong>Patient ID:</strong> {message.patientId}, <strong>Content:</strong> {message.content}
                                <button onClick={() => handleDeleteMessage(message.id)}>Delete</button>
                            </li>
                        ))
                    ) : (
                        <p>No messages available</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ManageMessages;