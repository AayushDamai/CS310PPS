// BillingPage.jsx
import React from 'react';
import NavBar from '../components/NavBar';
import BillingInfo from '../components/BillingInfo';

const BillingPage = () => { 
    return ( 
        <div className="billing-page">
        <NavBar />
        <h1 style={{padding: 10}}>Billing Information</h1>
        <BillingInfo />
        <h2 style={{padding: 10}}>Payment Information</h2>
        <p style={{padding: 10}}>Payment Method: Credit Card</p>
        <p style={{padding: 10}}>Card Number: **** **** **** 1234</p>
        <p style={{padding: 10}}>Expiration Date: 12/25</p>
        <p style={{padding: 10}}>CVV: ***</p>
        <h2 style={{padding: 10}}>Insurance Information</h2>
        <p style={{padding: 10}}>Insurance Provider: ABC Insurance</p>
        <p style={{padding: 10}}>Policy Number: 123456789</p>


        </div>
    )

}
export default BillingPage;