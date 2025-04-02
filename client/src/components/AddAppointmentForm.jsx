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
        const [appointmentLocation, setLocation] = useState('');
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

        const sendAppointmentData = async () => {
            var appointment = {
                patientID: patientID,
                doctorID: doctorID,
                appointmentLocation: appointmentLocation,
                appointment_time: appointment_time,
                
            }
            try {
                const res = await fetch('/api/sendAppointmentData', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(appointment)
                });
                
                const data = await res.json();
                if (res.ok) {
                    setStatus(data.message);
                } else {
                    setStatus(data.message);
                }
            } catch (error) {
                setStatus('Error sending data to server');
            }
        };
        return (
                <div className="input-form">
                    <p>Backend Status: {status}</p>
                    <div className='form-header'>
                        <h2>Add an Appointment</h2>
                    </div>
                    <input 
                        type="text"
                        id='PatientID'
                        value={patientID} 
                        onChange={(e) => setPatientID(e.target.value)} 
                        placeholder="PatientID"
                    />
                    <input 
                        type="text"
                        id='DoctorID'
                        value={doctorID} 
                        onChange={(e) => setDoctorID(e.target.value)} 
                        placeholder="DoctorID"
                    />
                    <input 
                        type="text"
                        id='Location'
                        value={appointmentLocation} 
                        onChange={(e) => setLocation(e.target.value)} 
                        placeholder="Location: Building: Room #"
                    />
                    <input 
                        type="date"
                        id='DOA'
                        value={appointment_time} 
                        onChange={(e) => setTime(e.target.value)} 
                        placeholder="Date: YYYY-MM-DD"
                    />
                
                    <button onClick={sendAppointmentData}>Submit</button>
                    <p>{status || "Waiting for input..."}</p>
                </div>
            );

        
}
export default AddAppointmentForm;
