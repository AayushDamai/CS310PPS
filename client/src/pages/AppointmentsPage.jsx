
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook to navigate between pages

    useEffect(() => {
        fetch('/api/getDoctorAppointments')
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setAppointments(data.appointments);
                }
            })
            .catch(() => setError('Error fetching appointments.'));
    }, []);

    return (
        <div>
            <h2>Upcoming Appointments</h2>

            {/* Back to Home Button */}
            <button className="back-button" onClick={() => navigate('/doctor-portal')}>
                Back to Home
            </button>

            {error ? (
                <p className="error">{error}</p>
            ) : (
                <ul className="appointment-list">
                    {appointments.map((appointment) => (
                        <li key={appointment.id} className="appointment-item">
                            <strong>Patient:</strong> {appointment.patient_name} <br />
                            <strong>Date:</strong> {appointment.appointment_time} <br />
                            <strong>Status:</strong> {appointment.status}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AppointmentsPage;