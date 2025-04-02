//AddAppointmentForm.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/InputForm.css';

const AddAppointmentForm = () =>{
    // Component states for backend connection status, name input, and server response
        const [status, setStatus] = useState('Connecting...');
        const [patientID, setPatientID] = useState('');
        const [doctorID, setDoctorID] = useState('');
        const [nurseID, setnurseID] = useState('');
        const [appointment_time, setTime] = useState('');
    
     // useEffects run code in response to changing state or props
        // Here, we use it to fetch initial data from the backend
        // get() routes use useEffects and are invoked when the page loads
        useEffect(() => {
            fetch('/api')
                .then(res => res.text())         // Parse text response
                .then(text => setStatus(text))   // Update status on success
                .catch(() => setStatus('Failed to connect to backend')); // Handle errors
        }, []); // Empty array = run once

        const sendRegistrationData = async () => {
            var appointment = {
                patientID: patientID,
                doctorID: doctorID,
                nurseID: nurseID,
                appointment_time: appointment_time,
                
            }
            try {
                const res = await fetch('/api/sendAppointmentData', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(user)
                });
                
                const data = await res.json();
                if (res.ok) {
                    setResponse(data.message);
                } else {
                    setResponse(data.message);
                }
            } catch (error) {
                setResponse('Error sending data to server');
            }
        };

        
}