// Prescription.js
import React from 'react';

const Prescription = () => {
    let medicationName = "Aspirin"
    let dosage= "500mg"
    let frequency = "Twice a day"
   
  return (
    <section className='prescription-card'>
        <h1 style={{padding: 10}}>Prescription Details</h1>
        <p>Medication: {medicationName}</p>
        <p>Dosage: {dosage}</p>
        <p>Frequency: {frequency}</p>
    </section>
  );
};

export default Prescription;