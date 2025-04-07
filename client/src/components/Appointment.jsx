// Appointment.js
import React, { useEffect } from 'react';
import { useAuth } from '../hooks/AuthContext'; 


const Appointment = () => {
  const [status, setStatus] = React.useState('');
  const [appointmentData, setAppointmentData] = React.useState('');
  const {user} = useAuth();
       
  // useEffect to check backend connection status
  useEffect(() => {
    fetch('/api')
      .then(res => res.text())         // Parse text response
      .then(text => setStatus(text))   // Update status on success
      .catch(() => setStatus('Failed to connect to backend')); // Handle errors

    const sendAppointmentData = async () => {
      try {
        console.log(`Sending userId: ${user}`); // Debugging line to check status
        const res = await fetch('/api/appointments/:patient_id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({user_id: user.userId})
        });
              
        const data = await res.json();
        if (res.ok) {
          let outputString = "";
          for (let index = 0; index < data.length; index++) {
            const appointmentJSON = data[index];
            for (const p in appointmentJSON){
              const appointmentField = appointmentJSON[p];
              outputString += p+": "+appointmentField +"\n";

            }
            
          }
            
            setAppointmentData(outputString); 
        } else {
        }
      } catch (error) {
          console.log('Error sending data to server:', error);
      }
    }
    sendAppointmentData(); // Call the function to send data
  }, []);

  return (
    <section className='project-source-card'>
      <p>{appointmentData}</p>
      
      
    </section>
  );
};

export default Appointment;