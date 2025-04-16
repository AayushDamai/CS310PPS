import React, { useState } from 'react';
import '../styles/InputForm.css';

const AddAppointmentForDoctor = () => {
    const doctorId = localStorage.getItem('userId'); // Automatically retrieve doctor ID from localStorage
    const [patientID, setPatientID] = useState('');
    const [appointmentLocation, setLocation] = useState('');
    const [appointmentDate, setDate] = useState('');
    const [appointmentTime, setTime] = useState('');
    const [status, setStatus] = useState('Scheduled'); // Default status
    const [responseMessage, setResponseMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!patientID || !appointmentLocation || !appointmentDate || !appointmentTime) {
            alert('Please fill out all fields.');
            return;
        }

        const appointment = {
            patientID,
            doctorID: doctorId,
            appointmentLocation,
            appointment_time: `${appointmentDate}T${appointmentTime}`, // Combine date and time
            status,
        };

        try {
            const response = await fetch('/api/sendAppointmentData', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appointment),
            });

            const data = await response.json();
            if (response.ok) {
                setResponseMessage('Appointment scheduled successfully!');
                setPatientID('');
                setLocation('');
                setDate('');
                setTime('');
            } else {
                setResponseMessage(data.message || 'Failed to schedule appointment.');
            }
        } catch (error) {
            console.error('Error scheduling appointment:', error);
            setResponseMessage('Error scheduling appointment.');
        }
    };

    return (
        <div className="input-form">
            <h2>Schedule an Appointment</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Patient ID:</label>
                    <input
                        type="text"
                        value={patientID}
                        onChange={(e) => setPatientID(e.target.value)}
                        placeholder="Enter Patient ID"
                        required
                    />
                </div>
                <div>
                    <label>Location:</label>
                    <input
                        type="text"
                        value={appointmentLocation}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter Location (e.g., Room 101)"
                        required
                    />
                </div>
                <div>
                    <label>Date:</label>
                    <input
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Time:</label>
                    <input
                        type="time"
                        value={appointmentTime}
                        onChange={(e) => setTime(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Schedule Appointment</button>
            </form>
            {responseMessage && <p>{responseMessage}</p>}
        </div>
    );
};

export default AddAppointmentForDoctor;