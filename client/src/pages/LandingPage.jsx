// LandingPage.jsx
import React from 'react';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import ContactCard from '../components/ContactCard';
import ProjectSourceCard from '../components/ProjectSourceCard';

const LandingPage = () => {
    return (
      <div className="landing-page">
        <NavBar />
        <Hero />
        <div className="sections-container"> 
          {/* Container for the contact card and project source card formatting*/}
         
        </div>
      </div>
    )
};

export default LandingPage;
