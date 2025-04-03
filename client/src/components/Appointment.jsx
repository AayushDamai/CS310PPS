// Appointment.js
import React, { useEffect } from 'react';


const Appointment = () => {
  let appointmentData = "";
    const {user} = useAuth();
        const  {patient_id} = user.userId;
       
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
                  if (res.ok) {
                      setStatus(data.message);
                     appointmentData = data.stringify; 
                  } else {
                      setStatus(data.message);
                      appointmentData = "";
                  }
              } catch (error) {
                  setStatus('Error sending data to server');
              }
          };
    
  return (
    <section className='project-source-card'>
      <p>{appointmentData}</p>
      
      
    </section>
  );
};

export default Appointment;