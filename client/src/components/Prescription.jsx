import React from 'react';

const Prescription = ({ medication, dosage, instructions, prescription_date }) => {
  return (
    <section className="prescription-card">
      <h1 style={{ padding: 10 }}>Prescription Details</h1>
      <p><strong>Medication:</strong> {medication}</p>
      <p><strong>Dosage:</strong> {dosage}</p>
      <p><strong>Instructions:</strong> {instructions}</p>
      <p><strong>Prescription Date:</strong> {new Date(prescription_date).toLocaleDateString()}</p>
    </section>
  );
};

export default Prescription;