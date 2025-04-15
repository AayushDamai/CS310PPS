import React, { useState, useEffect } from 'react';
import '../styles/ManageDoctors.css';

const ManageDoctors = () => {
    const [
        doctors, setDoctors] = useState([]); // Ensure this is an empty array
    const [newDoctor, setNewDoctor] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        specialty: '',
    });
    const [responseMessage, setResponseMessage] = useState('');

    // Fetch all doctors
    const fetchDoctors = async () => {
        try {
            const response = await fetch('/api/doctors');
            const data = await response.json();
            console.log('Fetched doctors:', data); // Log the response
            if (Array.isArray(data)) {
                setDoctors(data); // Set the state only if the response is an array
            } else {
                console.error('API did not return an array:', data);
                setDoctors([]); // Fallback to an empty array
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setDoctors([]); // Fallback to an empty array in case of an error
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    // Handle adding a new doctor
    const handleAddDoctor = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/doctors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDoctor),
            });

            const data = await response.json();
            if (response.ok) {
                setResponseMessage('Doctor added successfully!');
                setNewDoctor({ firstName: '', lastName: '', email: '', password: '', specialty: '' });
                fetchDoctors(); // Refresh the list of doctors
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
            const response = await fetch(`/api/doctors/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (response.ok) {
                setResponseMessage('Doctor deleted successfully!');
                fetchDoctors(); // Refresh the list of doctors
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

            {/* Add Doctor Form */}
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

            {/* List of Doctors */}
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
                        {Array.isArray(doctors) && doctors.length > 0 ? (
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
        </div>
    );
};

export default ManageDoctors;