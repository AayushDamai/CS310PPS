import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/InputForm.css';

const LoginForm = () => {
    // Component states for backend connection status, email, password, and server response
    const [status, setStatus] = useState('Connecting...');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState('');
    const navigate = useNavigate();

    // useEffect to check backend connection status
    useEffect(() => {
        fetch('/api')
            .then(res => res.text())         // Parse text response
            .then(text => setStatus(text))   // Update status on success
            .catch(() => setStatus('Failed to connect to backend')); // Handle errors
    }, []); // Empty array = run once

    // Function to send login info and handle response
    const sendLoginInfo = async () => {
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (res.ok) {
                // Handle redirection based on role
                if (data.role === 'Doctor') {
                    navigate('/doctor-dashboard');  // Redirect to doctor dashboard
                } else {
                    navigate('/patient-portal');  // Redirect to patient portal
                }
            } else {
                setResponse(data.message);  // Show error message from backend
            }
        } catch (error) {
            setResponse('Error sending data to server');  // Handle errors
        }
    };

    return (
        <div className="input-form">
            <p>Backend Status: {status}</p>
            <h2>Login to your account</h2>
            <input 
                type="email"
                id='email'
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email"
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
                <Link to="/forgot-info">Forgot Password?</Link>
            </div>
            <p>{response || "Waiting for input..."}</p>
        </div>
    );
}

export default LoginForm;
