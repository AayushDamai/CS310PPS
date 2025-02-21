// LoginForm.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/InputForm.css';

const RegistrationForm = () => {
    // Component states for backend connection status, name input, and server response
    const [status, setStatus] = useState('Connecting...');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDOB] = useState('');
    const [sex, setSex] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
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
    const sendRegistrationData = async () => {
        var user = {
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: dateOfBirth,
            sex: sex,
            address1: address1,
            address2: address2,
            email: email,
            phone: phone
        }
        try {
            const res = await fetch('/api/sendRegistrationData', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user })
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

    // Todo: Implement dropdown for user role selection
    return (
        <div className="input-form">
        <p>Backend Status: {status}</p>
        <div className='form-header'>
            <h2>Sign up for our Portal System!</h2>
        </div>
        <input 
            type="text"
            id='Firstname'
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            placeholder="First Name"
        />
        <input 
            type="text"
            id='Lastname'
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            placeholder="Last Name"
        />
        <input 
            type="text"
            id='DOB'
            value={dateOfBirth} 
            onChange={(e) => setDOB(e.target.value)} 
            placeholder="DOB: MM/DD/YYYY"
        />
        <input 
            type="text"
            id='Sex'
            value={sex} 
            onChange={(e) => setSex(e.target.value)} 
            placeholder="Sex"
        />
        <input 
            type="text"
            id='Address1'
            value={address1} 
            onChange={(e) => setAddress1(e.target.value)} 
            placeholder="Address Line 1"
        />
        <input 
            type="text"
            id='Address2'
            value={address2} 
            onChange={(e) => setAddress2(e.target.value)} 
            placeholder="Address Line 2"
        />
        <input 
            type="email"
            id='Email'
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email"
        />
        <input 
            type="number"
            id='Phone'
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            placeholder="Phone"
        />
        <button onClick={sendRegistrationData}>Register</button>
        <div className='redirect-buttons'>
            <Link to='/login'>Already have an account? Login!</Link>
        </div>
        <h3>Registration Info:</h3>
        <p>{response || "Waiting for input..."}</p>
        </div>
    );
}

export default RegistrationForm;
