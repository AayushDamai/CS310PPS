// ForgotInfoForm.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/InputForm.css';

const ForgotInfoForm = () => {
    // Component states for backend connection status, name input, and server response
    const [status, setStatus] = useState('Connecting...');
    const [email, setEmail] = useState('');
    const [response, setResponse] = useState('');

    // useEffects run code in response to changing state or props
    // Here, we use it to fetch initial data from the backend
    // get() routes use useEffects and are invoked when the page loads
    useEffect(() => {
        fetch('/api')
            .then(res => res.text())         // Parse text response
            .then(text => setStatus(text))   // Update status on success
            .catch(() => setStatus('Failed to connect to backend')); // Handle errors
    }, []); // Empty array = run once

    // Functions to send name to the server and update response state
    // post() routes use async/await and are invoked when the user interacts with the UI
    const sendUserData = async () => {
    try {
        const res = await fetch('/api/sendUserData', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email})
        });
        
        const data = await res.json();
        if (res.ok) {
            setResponse(data.body);
        } else {
            setResponse(data.message);
        }
    } catch (error) {
        setResponse('Error sending data to server');
        }
    };

    return (
    <div className="input-form">
      <p>Backend Status: {status}</p>
      <h2>Enter your email address and we'll send you a link to reset your account</h2>
      <input 
        type="text"
        id='email'
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email"
      />
      <button onClick={sendUserData}>Submit</button>
      <div className='redirect-buttons'>
        <Link to="/login">Back to login</Link>
      </div>
      <h3>Reset Info:</h3>
      <p>{response || "Waiting for input..."}</p>
    </div>
    );
}

export default ForgotInfoForm;
