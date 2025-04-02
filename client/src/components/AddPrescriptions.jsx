import React, { useState } from 'react';

const AddPrescriptions = ({ doctor_id }) => {
    const [prescData, setPrescData] = useState({
        patient_id: '',
        medication: '',
        dosage: '',
        frequency: '',
        instructions: '',
        prescription_date: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPrescData({ ...prescData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/AddPrescriptions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...prescData,
                    doctor_id: doctor_id // Use the correct variable
                })
            });
            if (response.ok) {
                alert('Prescription has been added!');
                setPrescData({
                    patient_id: '',
                    medication: '',
                    dosage: '',
                    frequency: '',
                    instructions: '',
                    prescription_date: ''
                });
            } else {
                alert('Failed to add prescription!');
            }
        } catch (error) {
            console.error('Error adding prescription:', error);
            alert('Error adding prescription!');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add a Prescription</h2>
            <label>
                Patient ID:
                <input
                    type="text"
                    name="patient_id"
                    value={prescData.patient_id}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                Medicine:
                <input
                    type="text"
                    name="medication"
                    value={prescData.medication}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                Dosage:
                <input
                    type="text"
                    name="dosage"
                    value={prescData.dosage}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                Instructions:
                <textarea
                    name="instructions"
                    value={prescData.instructions}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                Prescription Date:
                <input
                    type="date"
                    name="prescription_date"
                    value={prescData.prescription_date}
                    onChange={handleChange}
                    required
                />
            </label>
            <button type="submit">Add the Prescription</button>
        </form>
    );
};

export default AddPrescriptions;