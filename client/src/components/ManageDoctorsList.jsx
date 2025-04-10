import React, { useState, useEffect } from 'react';

const ManageDoctorsList = () => {
    const [doctors, setDoctors] = useState([]);

    // Fetch all doctors when the component loads
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

    // Handle deleting a doctor
    const handleDeleteDoctor = async (userId) => {
        try {
            const response = await fetch(`/api/doctors/${userId}`, { method: 'DELETE' });
            if (response.ok) {
                setDoctors(doctors.filter((doctor) => doctor.user_id !== userId));
            } else {
                console.error('Failed to delete doctor');
            }
        } catch (error) {
            console.error('Error deleting doctor:', error);
        }
    };

    return (
        <div>
            <h2>Manage Doctors List</h2>
            <ul>
                {doctors.map((doctor) => (
                    <li key={doctor.user_id}>
                        <strong>Name:</strong> {doctor.name} | <strong>Specialization:</strong> {doctor.specialization}
                        <button onClick={() => handleDeleteDoctor(doctor.user_id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageDoctorsList;