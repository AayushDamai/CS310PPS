import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]); // State to store appointments
  const [error, setError] = useState(''); // State to track errors
  const navigate = useNavigate(); // Hook to navigate between pages
  const doctorId = localStorage.getItem('userId'); // Retrieve doctor_id from localStorage

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (!doctorId) {
          setError('Doctor ID is missing. Please log in.');
          return;
        }

        // Fetch appointments for the logged-in doctor
        const response = await fetch(`/api/appointments?doctorId=${doctorId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch appointments.');
        }

        const data = await response.json();
        setAppointments(data); // Store appointments in state
      } catch (err) {
        setError(err.message || 'Error fetching appointments.');
      }
    };

    fetchAppointments();
  }, [doctorId]);

  return (
    <div className="appointments-page">
      <h2>Upcoming Appointments</h2>

      {/* Back to Home Button */}
      <button className="back-button" onClick={() => navigate('/doctor-dashboard')}>
        Back to Home
      </button>

      {error ? (
        <p className="error">{error}</p>
      ) : (
        <ul className="appointment-list">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="appointment-item">
              <strong>Patient:</strong> {appointment.patient_name} <br />
              <strong>Date:</strong> {new Date(appointment.appointment_time).toLocaleString()} <br />
              <strong>Status:</strong> {appointment.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AppointmentsPage;