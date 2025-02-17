/**
 * Root component - Main application layout
 * Contains route definitions and global state
 * Renders persistent UI elements (headers, footers)
 * Changed frequently as new features are added
*/

// React core imports
import React, { useEffect, useState } from 'react';

export default function App() {
  // Component state for backend connection status
  const [message, setMessage] = useState('Connecting...');

  // Fetch backend status on component mount
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
    </div>
  );
}