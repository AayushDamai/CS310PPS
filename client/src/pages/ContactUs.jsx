// ContactUs.jsx
import React from 'react';
import NavBar from '../components/NavBar';
import ContactCard from '../components/ContactCard';
import ProjectSourceCard from '../components/ProjectSourceCard';;

const ContactUsPage = () => {
  return (
      <div className="contact-us-page">
        <NavBar />
        <ContactCard />
        <ProjectSourceCard />
      </div>
    );
  }

export default ContactUsPage;
