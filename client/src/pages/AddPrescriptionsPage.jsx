import React from 'react';
import { useAuth } from '../hooks/AuthContext';
import NavBar from '../components/NavBar';
import AddPrescriptions from '../components/AddPrescriptions';

const AddPrescriptionsPage = () => {
    // const doctor_id = localStorage.getItem('userId');
    const { user } = useAuth();
    return (
        <div className="add-prescriptions-page">
            <NavBar />
            <AddPrescriptions doctor_id={user.userId} />
        </div>
    );
};

export default AddPrescriptionsPage;