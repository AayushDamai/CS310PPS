// LoginForm.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/InputForm.css';

const LoginForm = () => {
    // Component states for backend connection status, name input, and server response
    const [status, setStatus] = useState('Connecting...');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState('');
    const navigate = useNavigate();

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
    const sendLoginInfo = async () => {
    try {
        const res = await fetch('/api/sendLoginData', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName, password })
        });
        
        const data = await res.json();
        if (res.ok) {
            navigate('/patient-portal');
        } else {
            setResponse(data.error);
        }
    } catch (error) {
        setResponse('Error sending data to server');
        }
    };

    return (
    <div className="input-form">
      <p>Backend Status: {status}</p>
      <h2>Login to your account</h2>
      <input 
        type="text"
        id='username'
        value={userName} 
        onChange={(e) => setUserName(e.target.value)} 
        placeholder="Username"
      />
      <input 
        type="password"
        id='password'
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password"
      />
      <button onClick={sendLoginInfo}>Login</button>
      <div className='redirect-buttons'>
        <Link to="/register">New here? Sign up!</Link>
        <Link to="/forgot-info">Forgot Username/Password?</Link>
      </div>
      <p>{response || "Waiting for input..."}</p>
    </div>
    );
}

export default LoginForm;
