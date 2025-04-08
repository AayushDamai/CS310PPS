import React, { useState, useEffect } from 'react';

const ViewPrescriptions = ({ patientId }) => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const response = await fetch(`/api/prescriptions?patientId=${patientId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch prescriptions');
                }
                const data = await response.json();
                setPrescriptions(data);
            } catch (error) {
                console.error('Error fetching prescriptions:', error);
                setError('Failed to load prescriptions. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (patientId) {
            fetchPrescriptions();
        }
    }, [patientId]);

    if (!patientId) {
        return <div>Please log in to view your prescriptions.</div>;
    }

    if (loading) {
        return <div>Loading prescriptions...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div>
            <h3>Your Prescriptions</h3>
            {prescriptions.length > 0 ? (
                <ul className="prescription-list">
                    {prescriptions.map((prescription) => (
                        <li key={prescription.id} className="prescription-item">
                            <strong>Medication:</strong> {prescription.medication} <br />
                            <strong>Dosage:</strong> {prescription.dosage} <br />
                            <strong>Instructions:</strong> {prescription.instructions} <br />
                            <strong>Prescribed By:</strong> {prescription.doctor_name} <br />
                            <strong>Date:</strong> {new Date(prescription.prescription_date).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No prescriptions found.</p>
            )}
        </div>
    );
};

export default ViewPrescriptions;