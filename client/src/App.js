/**
 * Root component - Main application layout
 * Contains route definitions and global state
 * Renders persistent UI elements (headers, footers)
 * Changed frequently as new features are added
*/

// React core imports
import React, { useEffect, useState } from 'react';

export default function App() {
  // Component states for backend connection status, name input, and server response
  const [message, setMessage] = useState('Connecting...');
  const [name, setName] = useState('');
  const [response, setResponse] = useState('');

  // Function to send name to the server and update response state
  // post() routes use async/await and are invoked when the user interacts with the UI
  const sendData = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/uppercase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      
      const data = await res.json();
      if (res.ok) {
        setResponse(data.modifiedName);
      } else {
        setResponse(data.error);
      }
    } catch (error) {
      setResponse('Server connection failed.');
    }
  };

  // useEffects run code in response to changing state or props
  // Here, we use it to fetch initial data from the backend
  // get() routes use useEffects and are invoked when the page loads
  useEffect(() => {
    fetch('/api')
      .then(res => res.text())          // Parse text response
      .then(text => setMessage(text))   // Update status on success
      .catch(() => setMessage('Failed to connect to backend')); // Handle errors
  }, []); // Empty array = run once

  // Render UI
  return (
    <div className="container">
      <h1>CS310 Patient Portal System</h1>
      <p>Backend Status: {message}</p>
        <h2>Enter your name:</h2>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Type your name"
        />
        <button onClick={sendData}>Send</button>
          <h3>Modified Name:</h3>
          <p>{response || "Waiting for input..."}</p>
    </div>
  );
}