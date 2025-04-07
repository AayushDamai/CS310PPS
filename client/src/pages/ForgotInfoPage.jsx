// ForgotInfoPage.jsx
import React from 'react';
import NavBar from '../components/NavBar';
import ForgotInfoForm from '../components/ForgotInfoForm';

const ForgotInfoPage = () => {
    return (
        <div className="forgot-info-page">
            <NavBar />
            <div className="forgot-info-content">
                <h1>Forgot Your Information?</h1>
                <p>
                    Please fill out the form below to retrieve your account information. 
                    Make sure to provide the email address associated with your account.
                </p>
                <ForgotInfoForm />
            </div>
        </div>
    );
};

export default ForgotInfoPage;
