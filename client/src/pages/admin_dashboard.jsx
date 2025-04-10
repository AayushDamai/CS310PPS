import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';
import ManageDoctors from '../components/ManageDoctors';
import ManageUsers from '../components/ManageUsers';
import ManageAppointments from '../components/ManageAppointments';
import ManageMessages from '../components/ManageMessages';
import ManageDoctorsList from '../components/ManageDoctorsList'; // Import the new component

const AdminDashboard = () => {
    const navigate = useNavigate();

    // State for tabs and functionality
    const [activeTab, setActiveTab] = useState('manage-doctors'); // State to track the active tab
    const [adminName, setAdminName] = useState('Admin'); // State to store the admin's name

    // Fetch the admin's name when the component loads
    useEffect(() => {
        const fetchAdminName = async () => {
            try {
                const response = await fetch('/api/admin-details');
                const data = await response.json();
                if (response.ok) {
                    setAdminName(data.adminName); // Update the admin's name
                } else {
                    console.error('Failed to fetch admin name:', data.error);
                }
            } catch (error) {
                console.error('Error fetching admin name:', error);
            }
        };

        fetchAdminName();
    }, []);

    return (
        <div className="admin-dashboard">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="logo">Admin Dashboard</div>
                <nav>
                    <button
                        className={activeTab === 'manage-doctors' ? 'active-link' : ''}
                        onClick={() => setActiveTab('manage-doctors')}
                    >
                        Manage Doctors
                    </button>
                    <button
                        className={activeTab === 'manage-users' ? 'active-link' : ''}
                        onClick={() => setActiveTab('manage-users')}
                    >
                        Manage Users
                    </button>
                    <button
                        className={activeTab === 'manage-appointments' ? 'active-link' : ''}
                        onClick={() => setActiveTab('manage-appointments')}
                    >
                        Manage Appointments
                    </button>
                    <button
                        className={activeTab === 'manage-messages' ? 'active-link' : ''}
                        onClick={() => setActiveTab('manage-messages')}
                    >
                        Manage Messages
                    </button>
                    <button
                        className={activeTab === 'manage-doctors-list' ? 'active-link' : ''}
                        onClick={() => setActiveTab('manage-doctors-list')}
                    >
                        Manage Doctors List
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="header">
                    <h1>Welcome, {adminName}</h1>
                    <div className="account">
                        <a href="/profile">Your Profile</a> | <a href="/logout">Log Out</a>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="content-container">
                    {activeTab === 'manage-doctors' && (
                        <div className="dashboard-section">
                            <ManageDoctors />
                        </div>
                    )}
                    {activeTab === 'manage-users' && (
                        <div className="dashboard-section">
                            <ManageUsers />
                        </div>
                    )}
                    {activeTab === 'manage-appointments' && (
                        <div className="dashboard-section">
                            <ManageAppointments />
                        </div>
                    )}
                    {activeTab === 'manage-messages' && (
                        <div className="dashboard-section">
                            <ManageMessages />
                        </div>
                    )}
                    {activeTab === 'manage-doctors-list' && (
                        <div className="dashboard-section">
                            <ManageDoctorsList />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

