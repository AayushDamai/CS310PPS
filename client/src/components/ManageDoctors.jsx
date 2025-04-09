import React, { useState, useEffect } from 'react';

const ManageDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [newDoctor, setNewDoctor] = useState({ name: '', specialty: '' });

    // Fetch doctors when the component loads
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch('/api/doctors');
                const data = await response.json();
                setDoctors(data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };

        fetchDoctors();
    }, []);

    // Handle adding a new doctor
    const handleAddDoctor = async () => {
        try {
            const response = await fetch('/api/doctors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDoctor),
            });
            if (response.ok) {
                const addedDoctor = await response.json();
                setDoctors([...doctors, addedDoctor]);
                setNewDoctor({ name: '', specialty: '' });
            } else {
                console.error('Failed to add doctor');
            }
        } catch (error) {
            console.error('Error adding doctor:', error);
        }
    };

    // Handle deleting a doctor
    const handleDeleteDoctor = async (id) => {
        try {
            const response = await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setDoctors(doctors.filter((doctor) => doctor.id !== id));
            } else {
                console.error('Failed to delete doctor');
            }
        } catch (error) {
            console.error('Error deleting doctor:', error);
        }
    };

    return (
        <div>
            <h2>Manage Doctors</h2>

            {/* Add Doctor Form */}
            <div>
                <h3>Add New Doctor</h3>
                <input
                    type="text"
                    placeholder="Name"
                    value={newDoctor.name}
                    onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Specialty"
                    value={newDoctor.specialty}
                    onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                />
                <button onClick={handleAddDoctor}>Add Doctor</button>
            </div>

            {/* Doctors List */}
            <div>
                <h3>Doctors List</h3>
                <ul>
                    {doctors.map((doctor) => (
                        <li key={doctor.id}>
                            {doctor.name} - {doctor.specialty}
                            <button onClick={() => handleDeleteDoctor(doctor.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ManageDoctors;