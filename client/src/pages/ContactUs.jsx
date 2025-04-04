// ContactUs.jsx
import React from 'react';
import NavBar from '../components/NavBar';
import LinkCard from '../components/LinkCard';;

const ContactUsPage = () => {
    const emailLinks = [
        { text: "damai2@marshall.edu", url: "mailto:damai2@marshall.edu" },
        { text: "jewell62@marshall.edu", url: "mailto:jewell62@marshall.edu" },
        { text: "sturgill52@marshall.edu", url: "mailto:sturgill52@marshall.edu" },
        { text: "nesselrotte4@marshall.edu", url: "mailto:nesselrotte4@marshall.edu" },
        { text: "ronhovde@marshall.edu", url: "mailto:ronhovde@marshall.edu" }
    ];
    const projectLinks = [
        { text: "github.com/AayushDamai/CS310PPS", url: "https://github.com/AayushDamai/CS310PPS" },
    ];
    return (
        <div className="contact-us-page">
            <NavBar />
            <LinkCard title="Contact Us" links={emailLinks} />
            <LinkCard title="Project Repository" links={projectLinks} />
        </div>
    );
}

export default ContactUsPage;
