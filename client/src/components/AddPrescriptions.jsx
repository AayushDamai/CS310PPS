import React, { useState } from 'react';

const AddPrescriptions = () => {
    const [patientId, setPatientId] = useState(''); // State to track patient ID
    const [medication, setMedication] = useState(''); // State to track medication
    const [dosage, setDosage] = useState(''); // State to track dosage
    const [instructions, setInstructions] = useState(''); // State to track instructions
    const [prescriptions, setPrescriptions] = useState([]); // State to store prescriptions

    const handleAddPrescription = (e) => {
        e.preventDefault();
        const newPrescription = {
            patientId,
            medication,
            dosage,
            instructions,
        };

        // Add the new prescription to the list
        setPrescriptions([...prescriptions, newPrescription]);

        // Clear the form fields
        setPatientId('');
        setMedication('');
        setDosage('');
        setInstructions('');
    };

    return (
        <div className="add-prescriptions">
            <h2>Add a Prescription</h2>
            <form className="prescription-form" onSubmit={handleAddPrescription}>
                <div className="form-group">
                    <label>Patient ID:</label>
                    <input
                        type="text"
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                        placeholder="Enter Patient ID"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Medication:</label>
                    <input
                        type="text"
                        value={medication}
                        onChange={(e) => setMedication(e.target.value)}
                        placeholder="Enter Medication Name"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Dosage:</label>
                    <input
                        type="text"
                        value={dosage}
                        onChange={(e) => setDosage(e.target.value)}
                        placeholder="Enter Dosage"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Instructions:</label>
                    <textarea
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="Enter Instructions"
                        required
                    />
                </div>
                <button type="submit" className="btn-submit">
                    Add Prescription
                </button>
            </form>

            <h3></h3>
            <ul className="prescription-list">
                {prescriptions.map((prescription, index) => (
                    <li key={index} className="prescription-item">
                        <strong>Patient ID:</strong> {prescription.patientId} <br />
                        <strong>Medication:</strong> {prescription.medication} <br />
                        <strong>Dosage:</strong> {prescription.dosage} <br />
                        <strong>Instructions:</strong> {prescription.instructions}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AddPrescriptions;