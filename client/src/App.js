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
  const [status, setStatus] = useState('Connecting...');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState('');

  // Functions to send name to the server and update response state with altered name
  // post() routes use async/await and are invoked when the user interacts with the UI
  const sendLoginInfo = async () => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, password })
      });
      
      const data = await res.json();
      if (res.ok) {
        setResponse(data.body);
      } else {
        setResponse(data.error);
      }
    } catch (error) {
      setResponse('Error sending data to server');
    }
  };

  // useEffects run code in response to changing state or props
  // Here, we use it to fetch initial data from the backend
  // get() routes use useEffects and are invoked when the page loads
  useEffect(() => {
    fetch('/api')
      .then(res => res.text())          // Parse text response
      .then(text => setStatus(text))   // Update status on success
      .catch(() => setStatus('Failed to connect to backend')); // Handle errors
  }, []); // Empty array = run once

  // Render UI
  return (
    <div className="container">
      <h1>CS310 Patient Portal System</h1>
      <p>Backend Status: {status}</p>
        <h2>Enter your login info:</h2>
        <input 
          type="text" 
          value={userName} 
          onChange={(e) => setUserName(e.target.value)} 
          placeholder="Type your user name"
        />
        <input 
          type="text" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Type your password"
        />
        <button onClick={sendLoginInfo}>Submit</button>
          <h3>Login Info:</h3>
          <p>{response || "Waiting for input..."}</p>
    </div>
  );
}