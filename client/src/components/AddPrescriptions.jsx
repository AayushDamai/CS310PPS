import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddPrescriptions = () => {
    const doctor_id = localStorage.getItem('userId');
    const navigate = useNavigate();
    
    const [prescData, setPrescData] = useState({
        patient_id: '',
        medication: '',
        dosage: '',
        instructions: '',
        prescription_date: new Date().toISOString().split('T')[0] // Default to today's date
    });
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPrescData({ ...prescData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:5000/api/addprescriptions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...prescData,
                    doctor_id: doctor_id
                })
            });
            
            if (response.ok) {
                alert('Prescription has been added!');
                setPrescData({
                    patient_id: '',
                    medication: '',
                    dosage: '',
                    instructions: '',
                    prescription_date: new Date().toISOString().split('T')[0]
                });
            } else {
                const errorData = await response.json();
                alert(`Failed to add prescription: ${errorData.message || 'Unknown error'}`);
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
                    placeholder="5mg"
                />
            </label>
            <label>
                Instructions:
                <textarea
                    name="instructions"
                    value={prescData.instructions}
                    onChange={handleChange}
                    required
                    placeholder="Take with food x times a day."
                />y
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