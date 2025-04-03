// Appointment.js
import React, { useEffect } from 'react';
import { useAuth } from '../hooks/AuthContext'; 


const Appointment = () => {
  const [status, setStatus] = React.useState('');
  const [appointmentData, setAppointmentData] = React.useState('');
  const {user} = useAuth();
  const  patient_id = user;
       
  // useEffect to check backend connection status
  useEffect(() => {
    fetch('/api')
      .then(res => res.text())         // Parse text response
      .then(text => setStatus(text))   // Update status on success
      .catch(() => setStatus('Failed to connect to backend')); // Handle errors
  }, []); // Empty array = run once

  const sendAppointmentData = async () => {
    try {
      const res = await fetch('/api/appointments/:patient_id', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient_id)
      });
            
      const data = await res.json();
      console.log('Data received:', data); // Debugging line to check data received
      if (res.ok) {
          setStatus(data.message);
          setAppointmentData(data.message); 
      } else {
          setStatus(data.message);
      }
    } catch (error) {
        setStatus('Error sending data to server');
    }
  };

  console.log("Calling sendappointmentdata()"); // Debugging line to check status
  sendAppointmentData(); // this will send the appointment data to the server

  return (
    <section className='project-source-card'>
      <p>{appointmentData}</p>
      
      
    </section>
  );
};

export default Appointment;