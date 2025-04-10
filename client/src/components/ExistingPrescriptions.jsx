import React, { useState, useEffect } from 'react';

const ExistingPrescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]); // State to store prescriptions
    const [editingPrescription, setEditingPrescription] = useState(null); // State to track the prescription being edited
    const [loading, setLoading] = useState(true); // State to track loading
    const [error, setError] = useState(null); // State to track errors

    // Fetch prescriptions from the backend
    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/prescriptions');
                if (!response.ok) {
                    throw new Error('Failed to fetch prescriptions');
                }
                const data = await response.json();
                setPrescriptions(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchPrescriptions();
    }, []);

    // Handle editing a prescription
    const handleEdit = (prescription) => {
        setEditingPrescription(prescription); // Set the prescription to be edited
    };

    // Handle saving the edited prescription
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/prescriptions/${editingPrescription.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingPrescription),
            });

            if (response.ok) {
                // Update the prescription in the local state
                setPrescriptions((prevPrescriptions) =>
                    prevPrescriptions.map((prescription) =>
                        prescription.id === editingPrescription.id ? editingPrescription : prescription
                    )
                );
                setEditingPrescription(null); // Clear the editing state
            } else {
                console.error('Failed to save the prescription');
            }
        } catch (error) {
            console.error('Error saving prescription:', error);
        }
    };

    // Handle input changes for the editing form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingPrescription((prev) => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return <div>Loading prescriptions...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (prescriptions.length === 0) {
        return <div>No prescriptions found.</div>;
    }

    return (
        <div className="existing-prescriptions">
            <h2>Existing Prescriptions</h2>
            {editingPrescription ? (
                <form className="edit-prescription-form" onSubmit={handleSave}>
                    <div className="form-group">
                        <label>Patient ID:</label>
                        <input
                            type="text"
                            name="patientId"
                            value={editingPrescription.patientId}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Medication:</label>
                        <input
                            type="text"
                            name="medication"
                            value={editingPrescription.medication}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Dosage:</label>
                        <input
                            type="text"
                            name="dosage"
                            value={editingPrescription.dosage}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Instructions:</label>
                        <textarea
                            name="instructions"
                            value={editingPrescription.instructions}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-submit">
                        Save
                    </button>
                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => setEditingPrescription(null)}
                    >
                        Cancel
                    </button>
                </form>
            ) : (
                <ul className="prescription-list">
                {prescriptions.map((prescription) => (
        <li key={prescription.id} className="prescription-item">
            <strong>Patient ID:</strong> {prescription.patient_id} <br />
            <strong>Patient Name:</strong> {prescription.patient_name} <br />
            <strong>Medication:</strong> {prescription.medication} <br />
            <strong>Dosage:</strong> {prescription.dosage} <br />
            <strong>Instructions:</strong> {prescription.instructions} <br />
            <button onClick={() => handleEdit(prescription)}>Edit</button>
        </li>
    ))}
</ul>
            )}
        </div>
    );
};

export default ExistingPrescriptions;