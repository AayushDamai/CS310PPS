import React, { useState, useEffect } from 'react';

const ExistingPrescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]); // State to store prescriptions
    const [loading, setLoading] = useState(true); // State to track loading
    const [error, setError] = useState(null); // State to track errors

    // Fetch all prescriptions from the backend
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
            <h2>All Prescriptions</h2>
            <table className="prescriptions-table">
                <thead>
                    <tr>
                        <th>Patient Name</th>
                        <th>Doctor Name</th>
                        <th>Medication</th>
                        <th>Dosage</th>
                        <th>Instructions</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {prescriptions.map((prescription) => (
                        <tr key={prescription.id}>
                            <td>{prescription.patient_name}</td>
                            <td>{prescription.doctor_name}</td>
                            <td>{prescription.medication}</td>
                            <td>{prescription.dosage}</td>
                            <td>{prescription.instructions}</td>
                            <td>{new Date(prescription.prescription_date).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExistingPrescriptions;