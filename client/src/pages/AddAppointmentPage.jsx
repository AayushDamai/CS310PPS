//Add AppointmentPage.jsx
import React from 'react';
import NavBar from '../components/NavBar';
import AddAppointmentForm from '../components/AddAppointmentForm'

const AddAppointmentPage = () => {
    return (
        <div className="registration-page">
            <NavBar />
            <AddAppointmentForm />
        </div>
    );
}

export default AddAppointmentPage;