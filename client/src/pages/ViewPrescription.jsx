import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Prescription from '../components/Prescription';
import NavBar from '../components/NavBar';

const ViewPrescription = () => {
  const { patient_id } = useParams();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    console.log('Checking userId in ViewPrescription:', userId); // Debugging log
    if (!userId) {
        console.log('Redirecting to login because userId is missing'); // Debugging log
        navigate('/login');
        return;
    }

    const fetchPrescriptions = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/prescriptions/${patient_id}`);
            if (response.ok) {
                const data = await response.json();
                setPrescriptions(data);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to fetch prescriptions');
            }
        } catch (err) {
            console.error('Error fetching prescriptions:', err);
            setError('Error fetching prescriptions');
        }
    };

    fetchPrescriptions();

    return () => {
        setPrescriptions([]);
        setError(null);
    };
}, [patient_id, navigate]);

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