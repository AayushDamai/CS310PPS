// ContactCard.jsx
import React from 'react';
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
      </div>
    </section>
  );
};

export default ContactCard;
