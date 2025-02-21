// Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Hero.css';

const HeroSection = () => {
  return (
    <section className="hero">
      <h1>Welcome to our CS310 Healthcare Portal System Project!</h1>
      <p>Aayush, Chance, Ethan, Josh, Marcus</p>
      <Link to="/login" className="button">Get Started!</Link>
    </section>
  )
};

export default HeroSection;
