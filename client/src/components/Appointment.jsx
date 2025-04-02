// Appointment.js
import React from 'react';


const Appointment = () => {
    let roomNumber = 101
    let doctorName= "Dr. John Doe"
    let date = "Sept 9th 2025"
  return (
    <section className='project-source-card'>
      <p>Room {roomNumber}</p>
      <p>Seeing {doctorName}</p>
      <p>Date {date}</p>
    </section>
  );
};

export default Appointment;