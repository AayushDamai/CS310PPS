// LoginPage.jsx
import React from 'react';
import NavBar from '../components/NavBar';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
    return (
    <div className="login-page">
      <NavBar />
      <LoginForm />
    </div>
    );
}

export default LoginPage;
