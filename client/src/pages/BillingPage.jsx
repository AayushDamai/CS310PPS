// BillingPage.jsx
import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';

const BillingPage = () => {
    const [billingInfo, setBillingInfo] = useState(null); // State to store billing information
    const [error, setError] = useState(''); // State to track errors

    useEffect(() => {
        const fetchBillingInfo = async () => {
            try {
                // Fetch billing information from the backend
                const response = await fetch('/api/billing');
                if (!response.ok) {
                    throw new Error('Failed to fetch billing information.');
                }

                const data = await response.json();
                setBillingInfo(data); // Store billing information in state
            } catch (err) {
                setError(err.message || 'Error fetching billing information.');
            }
        };

        fetchBillingInfo();
    }, []);

    return (
        <div className="billing-page">
            <NavBar />

            <h1 style={{ padding: 10 }}>Billing Information</h1>

            {error ? (
                <p className="error" style={{ padding: 10 }}>{error}</p>
            ) : billingInfo ? (
                <div>
                    <h2 style={{ padding: 10 }}>Payment Information</h2>
                    <p style={{ padding: 10 }}>Payment Method: {billingInfo.paymentMethod}</p>
                    <p style={{ padding: 10 }}>Card Number: **** **** **** {billingInfo.cardLastFour}</p>
                    <p style={{ padding: 10 }}>Expiration Date: {billingInfo.expirationDate}</p>
                    <p style={{ padding: 10 }}>CVV: ***</p>

                    <h2 style={{ padding: 10 }}>Insurance Information</h2>
                    <p style={{ padding: 10 }}>Insurance Provider: {billingInfo.insuranceProvider}</p>
                    <p style={{ padding: 10 }}>Policy Number: {billingInfo.policyNumber}</p>
                </div>
            ) : (
                <p style={{ padding: 10 }}>Loading billing information...</p>
            )}
        </div>
    );
};

export default BillingPage;