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

   
    const sendLoginInfo = async () => {
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
    
            const data = await res.json();
            if (res.ok) {

                localStorage.removeItem('userId'); // remove the userId from local storage if it exists, so it doesn't show the wrong
                // this stores the userId in the local storage, so if the userId is a doctor it will allow verification 
                localStorage.setItem('userId', data.userId);
    
                if (data.role === 'Doctor') {
                    navigate('/doctor-dashboard');
                } else {
                    navigate('/patient-portal');  
                }
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
