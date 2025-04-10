// Appointment.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/AuthContext'; 


const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
  };
  
const getName = async (Id) => { // Changed to async function
  try {
    console.log(`Sending userId: ${Id}`);
    const res = await fetch('/api/name', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: Id })
    });

    if (res.ok) {
      const data = await res.json();
      return data.name; 
    } else {
      return "Error Bacon";
      
    }
  } catch (error) {
    console.error('Error sending data to server:', error);
    return "Error fetching name";
  }
};

const DoctorAppointment = () => {
  const [status, setStatus] = useState('');
  const [appointmentData, setAppointmentData] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetch('/api')
      .then(res => res.text())         // Parse text response
      .then(text => setStatus(text))   // Update status on success
      .catch(() => setStatus('Failed to connect to backend')); // Handle errors

    const sendAppointmentData = async () => {
      try {
        console.log(`Sending userId: ${user.userId}`); // Debugging line to check status
        const res = await fetch('/api/appointments/:doctor_id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.userId })
        });

        const data = await res.json();
        if (res.ok) {
          let outputString = "";
          for (let index = 0; index < data.length; index++) {
            const appointmentJSON = data[index];
            const currentPatientName = await getName(appointmentJSON['patient_id']); // Await the async function
            
            outputString += `<div>See Patient: ${currentPatientName}<br>`;
            outputString += `Location: ${appointmentJSON['location']}<br>`;
            const formattedDate = formatDate(appointmentJSON['appointment_time']); // Format the date
            outputString += `Date: ${formattedDate}</div><br>`;
            outputString += `Date: ${appointmentJSON['status']}</div><br>`;


          }
          setAppointmentData(outputString);
        }
      } catch (error) {
        console.log('Error sending data to server:', error);
      }
    };
    sendAppointmentData(); // Call the function to send data
  }, [user]);

  return (
    <section className='project-source-card'>

    <div dangerouslySetInnerHTML={{ __html: appointmentData }} />
    </section>
  );
};

export default Appointment;
