// LandingPage.jsx
import React from 'react';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import '../index.css'

const LandingPage = () => {
    return (
        <div className="landing-page">
            <NavBar />
            <Hero />
        </div>
    );
}

export default LandingPage;
