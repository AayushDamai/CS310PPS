import React from 'react';
import AddPrescriptions from '../components/AddPrescriptions';
import NavBar from '../components/NavBar';


const AddPrescriptionsPage = () => { 
    const doctor_id = localStorage.getItem('userId'); 
    return ( 
        <div className="add-prescriptions-page">
               <NavBar />
               <AddPrescriptions doctor_id={doctor_id} />


           
        </div>
    );
};

export default AddPrescriptionsPage;