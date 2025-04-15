import React from 'react';

function AddDoctorForm({ handleAddDoctor, newDoctor, setNewDoctor }) {
    return (
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
            <input
                type="date"
                placeholder="Date of Birth"
                value={newDoctor.dateOfBirth}
                onChange={(e) => setNewDoctor({ ...newDoctor, dateOfBirth: e.target.value })}
                required
            />
            <button type="submit">Add Doctor</button>
        </form>
    );
}

export default AddDoctorForm;