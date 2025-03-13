// ContactCard.js
import React from 'react';
import '../styles/LinkCard.css';

const LinkCard = ({title, links}) => {
  return (
    <section className='link-card'>
      <h1>{title}</h1>
      <ul className='link-list'>
        {links.map((link, index) => (
        <li key={index} className='link'>
          <a href={link.url} >{link.text} </a>
        </li>
        ))}
      </ul>
    </section>
  );
};

export default LinkCard;
