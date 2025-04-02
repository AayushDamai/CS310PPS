//Add AppointmentPage.jsx
import React from 'react';
import NavBar from '../components/NavBar';

const AddAppointmentPage = () => {
    return (
        <div className="registration-page">
          <NavBar />
          <AddAppointmentPage/>
        </div>
        );
}

export default AddAppointmentPage;