// ContactCard.js
import React from 'react';


const AppointmentSection = () => {
    let roomNumber = 101
    let doctorName= "Dr. John Doe"
    let date = "Sept 9th 2025"
  return (
    <section className='Appointment'>
      <p>Room{roomNumber}</p>
      <p>Seeing {doctorName}</p>
      <p>Date {date}</p>
    </section>
  );
};

export default AppointmentSection;