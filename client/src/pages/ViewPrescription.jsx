import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Prescription from '../components/Prescription';

const ViewPrescription = () => {
    const { patient_id } = useParams(); 
    const [prescription, setPrescription] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log(`Fetching prescription for patient_id: ${patient_id}`); 
    
        fetch(`http://localhost:5000/prescriptions/${patient_id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch prescription data');
                }
                return response.json();
            })
            .then((data) => {
                console.log('Prescription data:', data); 
                setPrescription(data);
            })
            .catch((err) => {
                console.error('Error fetching prescription data:', err);
                setError('Failed to load prescription data');
            });
    }, [patient_id]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!prescription) {
        return <div>Loading...</div>;
    }

    return (
        <div className="medication-page">
            <NavBar />
            <Link to="/patient-portal" className="back-button">Back to Portal</Link>
            {prescription.map((pres, index) => (
                <Prescription
                    key={index}
                    medication={pres.medication}
                    dosage={pres.dosage}
                    instructions={pres.instructions}
                    prescription_date={pres.prescription_date}
                />
            ))}
        </div>
    );
};

export default ViewPrescription;