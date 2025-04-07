import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hook/AuthContext.jsx'; // Corrected path
import '../styles/NavPanel.css';

const NavPanel = () => {
    const { user } = useAuth();
    const userRole = user?.user_role || 'patient'; // default to 'patient' if undefined

    // Define left-side navigation links based on the user's role
    let leftNavLinks = [
        { label: 'Appointments', path: '/appointment-page' },
        { label: 'Prescriptions', path: `/prescriptions/${user.userId}` },
        { label: 'Lab Results', path: '/labresults' },
        { label: 'Messages', path: '/messages' }
    ];

    if (userRole === 'doctor') {
        leftNavLinks = [
            { label: 'Add Prescription', path: '/doctors/add-prescription' }
        ];
    }

    return (
        <aside className="side-nav">
            <ul>
                {leftNavLinks.map((link, index) => (
                    <li key={index}>
                        <Link to={link.path}>{link.label}</Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default NavPanel;