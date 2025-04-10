import React, { useState } from 'react';
import { useAuth } from '../hooks/AuthContext';

const AddPrescriptions = () => {
    // const doctor_id = localStorage.getItem('userId'); //get doctorId 
    const { user } = useAuth(); //get userId from AuthContext

    const [prescData, setPrescData] = useState({
        patient_id: '',
        medication: '',
        dosage: '',
        instructions: '',
        prescription_date: new Date().toISOString().split('T')[0] //this pulls up todays date only
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
                    doctor_id: user.userId //send doctorId to backend
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

    return ( //the actual like form stuff
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
                <input
                    name="instructions"
                    value={prescData.instructions}
                    onChange={handleChange}
                    required
                    placeholder="Take with food x times a day."
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