import React, { useState, useEffect } from 'react';
import '../styles/ManagePatients.css';

const ManagePatients = () => {
    const [activeSubTab, setActiveSubTab] = useState('add-patient');
    const [patients, setPatients] = useState([]);
    const [newPatient, setNewPatient] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        dateOfBirth: '',
        sex: '', // Default value
        address1: '',
        address2: '',
    });
    const [responseMessage, setResponseMessage] = useState('');

    // Fetch all patients
    const fetchPatients = async () => {
        try {
            const response = await fetch('/api/patients');
            const data = await response.json();
            setPatients(data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    // Handle adding a new patient
    const handleAddPatient = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/patients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPatient),
            });
            const data = await response.json();
            if (response.ok) {
                setResponseMessage('Patient added successfully!');
                setNewPatient({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    dateOfBirth: '',
                    sex: '',
                    address1: '',
                    address2: '',
                });
                fetchPatients();
            } else {
                setResponseMessage(data.error || 'Failed to add patient.');
            }
        } catch (error) {
            console.error('Error adding patient:', error);
            setResponseMessage('Error adding patient.');
        }
    };

    // Handle deleting a patient
    const handleDeletePatient = async (id) => {
        if (!window.confirm('Are you sure you want to delete this patient?')) return;
        try {
            const response = await fetch(`/api/patients/${id}`, { method: 'DELETE' });
            const data = await response.json();
            if (response.ok) {
                setResponseMessage('Patient deleted successfully!');
                fetchPatients();
            } else {
                setResponseMessage(data.error || 'Failed to delete patient.');
            }
        } catch (error) {
            console.error('Error deleting patient:', error);
            setResponseMessage('Error deleting patient.');
        }
    };

    return (
        <div className="manage-patients">
            <h2>Manage Patients</h2>

            {/* Sub-tabs */}
            <div className="sub-tabs">
                <button
                    className={activeSubTab === 'add-patient' ? 'active-link' : ''}
                    onClick={() => setActiveSubTab('add-patient')}
                >
                    Add Patient
                </button>
                <button
                    className={activeSubTab === 'patient-list' ? 'active-link' : ''}
                    onClick={() => setActiveSubTab('patient-list')}
                >
                    Patient List
                </button>
            </div>

            {/* Sub-tab Content */}
            <div className="sub-tab-content">
                {activeSubTab === 'add-patient' && (
                    <div className="add-patient-form">
                        <h3>Add New Patient</h3>
                        <form onSubmit={handleAddPatient}>
                            <input
                                type="text"
                                placeholder="First Name"
                                value={newPatient.firstName}

                                onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={newPatient.lastName}
                                onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={newPatient.email}
                                onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={newPatient.password}
                                onChange={(e) => setNewPatient({ ...newPatient, password: e.target.value })}
                                required
                            />
                            <input
                                type="date"
                                placeholder="Date of Birth"
                                value={newPatient.dateOfBirth}
                                onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
                                required
                            />
                            <select
                                value={newPatient.sex}
                                onChange={(e) => setNewPatient({ ...newPatient, sex: e.target.value })}
                                required
                            >
                                <option value="">Select Sex</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Prefer Not To Say">Prefer Not To Say</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Address 1"
                                value={newPatient.address1}
                                onChange={(e) => setNewPatient({ ...newPatient, address1: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Address 2 (Optional)"
                                value={newPatient.address2}
                                onChange={(e) => setNewPatient({ ...newPatient, address2: e.target.value })}
                            />
                            <button type="submit">Add Patient</button>
                        </form>
                        {responseMessage && <p>{responseMessage}</p>}
                    </div>
                )}

                {activeSubTab === 'patient-list' && (
                    <div className="patient-list">
                        <h3>All Patients</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.length > 0 ? (
                                    patients.map((patient) => (
                                        <tr key={patient.id}>
                                            <td>{`${patient.first_name} ${patient.last_name}`}</td>
                                            <td>{patient.email}</td>
                                            <td>
                                                <button onClick={() => handleDeletePatient(patient.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3">No patients found.</td>
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

export default ManagePatients;