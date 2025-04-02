import React from 'react';
import AddPrescriptions from '../components/AddPrescriptions';
import NavBar from '../components/NavBar';

const AddPrescriptionsPage = () => { 
    return ( 
        <div className="add-prescriptions-page">
            <NavBar />
            <div className="content-container">
                <AddPrescriptions />
            </div>
        </div>
    );
};

export default AddPrescriptionsPage;