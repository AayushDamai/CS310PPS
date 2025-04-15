import React, { useState, useEffect } from 'react';
import '../styles/ManageDoctors.css';

const ManageDoctors = () => {
    const [activeSubTab, setActiveSubTab] = useState('add-doctor');
    const [doctors, setDoctors] = useState([]);
    const [newDoctor, setNewDoctor] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        dateOfBirth: '',
        sex: '', // Default value
        address1: '',
        address2: '',
        role: 'Doctor', // Default value
        specialty: '',
    });
    const [responseMessage, setResponseMessage] = useState('');

    // Fetch all doctors
    const fetchDoctors = async () => {
        try {
            const response = await fetch('/api/doctors');
            const data = await response.json();
            setDoctors(data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    // Handle adding a new doctor
    const handleAddDoctor = async (e) => {
        e.preventDefault();
        console.log('Submitting new doctor:', newDoctor); // Debug log
        try {
            const response = await fetch('/api/doctors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDoctor),
            });
            const data = await response.json();
            if (response.ok) {
                setResponseMessage('Doctor added successfully!');
                setNewDoctor({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    dateOfBirth: '',
                    sex: '',
                    address1: '',
                    address2: '',
                    role: 'Doctor',
                    specialty: '',
                });
                fetchDoctors();
            } else {
                setResponseMessage(data.error || 'Failed to add doctor.');
            }
        } catch (error) {
            console.error('Error adding doctor:', error);
            setResponseMessage('Error adding doctor.');
        }
    };

    // Handle deleting a doctor
    const handleDeleteDoctor = async (id) => {
        if (!window.confirm('Are you sure you want to delete this doctor?')) return;
        try {
            const response = await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
            const data = await response.json();
            if (response.ok) {
                setResponseMessage('Doctor deleted successfully!');
                fetchDoctors();
            } else {
                setResponseMessage(data.error || 'Failed to delete doctor.');
            }
        } catch (error) {
            console.error('Error deleting doctor:', error);
            setResponseMessage('Error deleting doctor.');
        }
    };

    return (
        <div className="manage-doctors">
            <h2>Manage Doctors</h2>

            {/* Sub-tabs */}
            <div className="sub-tabs">
                <button
                    className={activeSubTab === 'add-doctor' ? 'active-link' : ''}
                    onClick={() => setActiveSubTab('add-doctor')}
                >
                    Add Doctor
                </button>
                <button
                    className={activeSubTab === 'doctor-list' ? 'active-link' : ''}
                    onClick={() => setActiveSubTab('doctor-list')}
                >
                    Doctor List
                </button>
            </div>

            {/* Sub-tab Content */}
            <div className="sub-tab-content">
                {activeSubTab === 'add-doctor' && (
                    <div className="add-doctor-form">
                        <h3>Add New Doctor</h3>
                        <form onSubmit={handleAddDoctor}>
                            <input
                                type="text"
                                placeholder="First Name"
                                value={newDoctor.firstName}
                                onChange={(e) => setNewDoctor({ ...newDoctor, firstName: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={newDoctor.lastName}
                                onChange={(e) => setNewDoctor({ ...newDoctor, lastName: e.target.value })}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={newDoctor.email}
                                onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={newDoctor.password}
                                onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })}
                                required
                            />
                            <input
                                type="date"
                                placeholder="Date of Birth"
                                value={newDoctor.dateOfBirth}
                                onChange={(e) => setNewDoctor({ ...newDoctor, dateOfBirth: e.target.value })}
                                required
                            />
                            <select
                                value={newDoctor.sex}
                                onChange={(e) => setNewDoctor({ ...newDoctor, sex: e.target.value })}
                                required
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Prefer Not To Say">Prefer Not To Say</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Address 1"
                                value={newDoctor.address1}
                                onChange={(e) => setNewDoctor({ ...newDoctor, address1: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Address 2 (Optional)"
                                value={newDoctor.address2}
                                onChange={(e) => setNewDoctor({ ...newDoctor, address2: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Specialty"
                                value={newDoctor.specialty}
                                onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                                required
                            />
                            <button type="submit">Add Doctor</button>
                        </form>
                        {responseMessage && <p>{responseMessage}</p>}
                    </div>
                )}

                {activeSubTab === 'doctor-list' && (
                    <div className="doctor-list">
                        <h3>All Doctors</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Specialty</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctors.length > 0 ? (
                                    doctors.map((doctor) => (
                                        <tr key={doctor.id}>
                                            <td>{`${doctor.first_name} ${doctor.last_name}`}</td>
                                            <td>{doctor.email}</td>
                                            <td>{doctor.specialty}</td>
                                            <td>
                                                <button onClick={() => handleDeleteDoctor(doctor.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No doctors found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageDoctors;