import React, { useState, useEffect } from 'react';

const ManageAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [newAppointment, setNewAppointment] = useState({
        doctorId: localStorage.getItem('userId') || '', // Automatically set doctorId from localStorage
        patientId: '',
        date: '',
        time: '',
    });
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const doctorId = localStorage.getItem('userId'); // Retrieve doctorId from localStorage
    console.log('Doctor ID from localStorage:', doctorId); // Debug log

    // Fetch appointments when the component loads
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch('/api/appointments');
                const data = await response.json();
                console.log('Appointments API Response:', data); // Debugging
                setAppointments(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();
    }, []);

    // Handle adding a new appointment
    const handleAddAppointment = async () => {
        try {
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAppointment),
            });
            if (response.ok) {
                const addedAppointment = await response.json();
                setAppointments([...appointments, addedAppointment]);
                setNewAppointment({ doctorId, patientId: '', date: '', time: '' });
            } else {
                console.error('Failed to add appointment');
            }
        } catch (error) {
            console.error('Error adding appointment:', error);
        }
    };

    // Handle deleting an appointment
    const handleDeleteAppointment = async (appointmentId) => {
        if (!window.confirm('Are you sure you want to delete this appointment?')) return;

        console.log('Attempting to delete appointment with ID:', appointmentId);
        console.log('Doctor ID:', doctorId);

        try {
            const response = await fetch(`/api/appointments/${appointmentId}?doctorId=${doctorId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Appointment deleted successfully!');
                setAppointments(appointments.filter((appt) => appt.id !== appointmentId));
                setSelectedAppointment(null);
            } else {
                const errorData = await response.json();
                console.error('Error response from server:', errorData);
                alert(errorData.error || 'Failed to delete appointment.');
            }
        } catch (error) {
            console.error('Error deleting appointment:', error);
            alert('Error deleting appointment.');
        }
    };

    return (
        <div>
            <h2>Manage Appointments</h2>

            {/* Add Appointment Form */}
            <div>
                <h3>Add New Appointment</h3>
                <input
                    type="text"
                    placeholder="Doctor ID"
                    value={newAppointment.doctorId}
                    onChange={(e) => setNewAppointment({ ...newAppointment, doctorId: e.target.value })}
                    disabled // Doctor ID is fixed for the logged-in doctor
                />
                <input
                    type="text"
                    placeholder="Patient ID"
                    value={newAppointment.patientId}
                    onChange={(e) => setNewAppointment({ ...newAppointment, patientId: e.target.value })}
                />
                <input
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                />
                <input
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                />
                <button onClick={handleAddAppointment}>Add Appointment</button>
            </div>

            {/* Appointments List */}
            <div>
                <h3>Appointments List</h3>
                <ul>
                    {Array.isArray(appointments) && appointments.length > 0 ? (
                        appointments.map((appointment) => (
                            <li key={appointment.id}>
                                Doctor ID: {appointment.doctorId}, Patient ID: {appointment.patientId}, Date: {appointment.date}, Time: {appointment.time}
                                <button onClick={() => handleDeleteAppointment(appointment.id)}>Delete</button>
                            </li>
                        ))
                    ) : (
                        <p>No appointments available</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ManageAppointments;