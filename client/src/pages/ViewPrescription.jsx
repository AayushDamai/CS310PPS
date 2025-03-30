// ViewPrescription.jsx
import React from 'react';
import NavBar from '../components/NavBar';
import Prescription from '../components/Prescription';

const ViewPrescription = () => {
    return (
        <div className="medication-page">
          <NavBar />
          <Prescription />
         
        </div>
    );
}

export default ViewPrescription;