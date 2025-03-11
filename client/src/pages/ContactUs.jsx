// ContactUs.jsx
import React from 'react';
import NavBar from '../components/NavBar';
import '../styles/ContactCard.css';

const ContactCard = () => {
  return (
    <section className='contact-card'>
      <h1>Contact Us</h1>
      <div className="email-links">
     
        <p><a href="mailto:damai2@marshall.edu">damai2@marshall.edu</a></p>
        <p><a href="mailto:jewell62@marshall.edu">jewell62@marshall.edu</a></p>
        <p><a href="mailto:sturgill52@marshall.edu">sturgill52@marshall.edu</a></p>
        <p><a href="mailto:ronhovde@marshall.edu">ronhovde@marshall.edu</a></p>
        <p><a href="mailto:nesselrotte4@marshall.edu">nesselrotte4@marshall.edu</a></p>

        <h1>Project Source</h1>
      <div className="github-link">
        <p><a href="https://github.com/AayushDamai/CS310PPS" target="_blank">GitHub</a></p>
      </div>
    
      </div>
    </section>

  );
};

export default ContactCard;
