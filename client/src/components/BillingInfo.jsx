//BillingInfo.jsx
import React from 'react';
import NavBar from '../components/NavBar';


const BillingInfo = () => {
    let userPayment = "$100000000000";
    let userInsurance = "$0.000034232";

    return (
        <div className="billing-info-page">
          <NavBar />
          <h1 style={{ padding: 10 }}>Billing Information</h1>
        </div>
    );
};

export default BillingInfo;
