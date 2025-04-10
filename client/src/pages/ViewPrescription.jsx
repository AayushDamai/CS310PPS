import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import Prescription from '../components/Prescription';
import NavBar from '../components/NavBar';

const ViewPrescription = () => {
    const { patient_id } = useParams();
    const navigate = useNavigate();
    const [prescriptions, setPrescriptions] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const userId = user.userId;

        // Ensure the logged-in user matches the patient_id
        if (userId !== patient_id) {
            console.error('Unauthorized access: patient_id does not match logged-in user.');
            setError('You are not authorized to view these prescriptions.');
            setLoading(false);
            return;
        }

        const fetchPrescriptions = async () => {
            try {
                const response = await fetch(`/api/prescriptions?patientId=${patient_id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token if needed
                    },
                });
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

        fetchPrescriptions();

        return () => {
            setPrescriptions([]);
            setError(null);
            setLoading(true);
        };
    }, [patient_id, user.userId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="prescriptions-page">
            <NavBar />
            <h1>Your Prescriptions</h1>
            {prescriptions.length > 0 ? (
                prescriptions.map((prescription) => (
                    <Prescription
                        key={prescription.id}
                        medication={prescription.medication}
                        dosage={prescription.dosage}
                        instructions={prescription.instructions}
                        prescription_date={prescription.prescription_date}
                    />
                ))
            ) : (
                <p>No prescriptions found.</p>
            )}
        </div>
    );
};

export default ViewPrescription;