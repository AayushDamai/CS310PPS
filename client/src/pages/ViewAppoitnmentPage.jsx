// ViewAppoitnmentPage.jsx
import React from 'react';
import NavBar from '../components/NavBar';
import Appointment  from '../components/Appointment';

const ViewAppoitnmentPage = () => {
    return (
        <div className="forgot-info-page">
          <NavBar />
          <Appointment />
          <Appointment />
          <Appointment />
        </div>
    );
}

export default ViewAppoitnmentPage;
