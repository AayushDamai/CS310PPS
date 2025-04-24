// AddAppointmentForm.jsx
import React, { useState, useEffect } from 'react';
import '../styles/InputForm.css';

const AddAppointmentForm = () => {
    // Component states for backend connection status, name input, and server response
    const [status, setStatus] = useState('Connecting...');
    const [patientID, setPatientID] = useState('');
    const [doctorID, setDoctorID] = useState('');
    const [appointmentLocation, setLocation] = useState('');
    const [appointmentDate, setDate] = useState('');
    const [appointmentTime, setTime] = useState(''); // New state for time
    const [role, setRole] = useState(null); // State to store the user's role

    // Fetch the user's role from localStorage or backend
    useEffect(() => {
        const userRole = localStorage.getItem('role'); // Assuming role is stored in localStorage
        setRole(userRole);
    }, []);

    // useEffects run code in response to changing state or props
    useEffect(() => {
        fetch('/api')
            .then(res => res.text())         // Parse text response
            .then(text => setStatus(text))   // Update status on success
            .catch(() => setStatus('Failed to connect to backend')); // Handle errors
    }, []); // Empty array = run once

    const sendAppointmentData = async () => {
        const appointment = {
            patientID: patientID,
            doctorID: doctorID,
            appointmentLocation: appointmentLocation,
            appointment_time: `${appointmentDate}T${appointmentTime}`, // Combine date and time
            status: 'Scheduled', // Add a default status
        };
        try {
            const res = await fetch('/api/sendAppointmentData', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appointment),
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

    // Render the form only if the user is an admin
    if (role !== 'Admin') {
        return <p>You do not have permission to add appointments.</p>;
    }

    return (
        <div className="input-form">
            <p>Backend Status: {status}</p>
            <div className="form-header">
                <h2>Add an Appointment</h2>
            </div>
            <input
                type="text"
                id="PatientID"
                value={patientID}
                onChange={(e) => setPatientID(e.target.value)}
                placeholder="PatientID"
            />
            <input
                type="text"
                id="DoctorID"
                value={doctorID}
                onChange={(e) => setDoctorID(e.target.value)}
                placeholder="DoctorID"
            />
            <input
                type="text"
                id="Location"
                value={appointmentLocation}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location: Building: Room #"
            />
            <input
                type="date"
                id="DOA"
                value={appointmentDate}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Date: YYYY-MM-DD"
            />
            <input
                type="time"
                id="TOA"
                value={appointmentTime}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Time: HH:MM"
            />
            <button onClick={sendAppointmentData}>Submit</button>
            <p>{status || 'Waiting for input...'}</p>
        </div>
    );
};

export default AddAppointmentForm;
