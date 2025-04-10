//ViewDoctorAppointmentPage.jsx
import React from 'react';
import NavBar from '../components/NavBar';
import DoctorAppointment from '../components/Appointment';

const ViewDoctorAppoitmentPage = () => {
    return (
        <div className="forgot-info-page">
          <NavBar />
          <DoctorAppointment />
        </div>
    );
}

export default ViewDoctorAppointmentPage;