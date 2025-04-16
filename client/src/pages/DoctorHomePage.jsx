import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dochomepage.css';
import DoctorCalendar from '../components/DoctorCalendar';
import AddPrescriptions from '../components/AddPrescriptions';
import ExistingPrescriptions from '../components/ExistingPrescriptions';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-time-picker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import MessagesPage from '../components/MessagesPage';
import LabTestResultsPage from '../components/LabTestResultsPage';
import AddAppointmentForDoctor from '../components/AddAppointmentForDoctor';
import DoctorLabTestResults from '../components/DoctorLabTestResults';

const DoctorHomePage = () => {
    const navigate = useNavigate();
    const doctorId = localStorage.getItem('userId'); // Retrieve doctor_id from localStorage

    // State for tabs and functionality
    const [activeTab, setActiveTab] = useState('calendar'); // State to track the active tab
    const [prescriptionSubTab, setPrescriptionSubTab] = useState('add'); // Sub-tab for prescriptions
    const [appointments, setAppointments] = useState([]); // State to store appointments
    const [selectedAppointment, setSelectedAppointment] = useState(null); // State to track selected appointment
    const [updatedAppointment, setUpdatedAppointment] = useState({}); // State for editing appointment
    const [doctorName, setDoctorName] = useState('Doctor'); // State to store the doctor's name

    // Fetch the doctor's name when the component loads
    useEffect(() => {
        const fetchDoctorName = async () => {
            try {
                const response = await fetch(`/api/doctor-details?doctorId=${doctorId}`);
                const data = await response.json();
                if (response.ok) {
                    setDoctorName(data.doctorName); // Update the doctor's name
                } else {
                    console.error('Failed to fetch doctor name:', data.error);
                }
            } catch (error) {
                console.error('Error fetching doctor name:', error);
            }
        };

        fetchDoctorName();
    }, [doctorId]);

    // Fetch appointments when the "Edit Appointments" tab is active
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch(`/api/appointments?doctorId=${doctorId}`);
                const data = await response.json();
                setAppointments(data); // Store appointments in state
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        if (activeTab === 'edit-appointments') {
            fetchAppointments();
        }
    }, [activeTab, doctorId]);

    // Handle changes in the appointment editing form
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setUpdatedAppointment({ ...updatedAppointment, [name]: value });
    };

    // Handle submitting the appointment editing form
    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const { appointment_date, appointment_time, status } = updatedAppointment;

        if (!appointment_date || !appointment_time || !status) {
            alert('Please fill out all fields before submitting.');
            return;
        }

        // Combine date and time into MySQL-compatible format
        const formattedDateTime = `${appointment_date} ${appointment_time}`;

        try {
            const response = await fetch(`/api/appointments/${selectedAppointment.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    appointment_time: formattedDateTime, // Send combined datetime
                    status, // Send status
                }),
            });

            if (response.ok) {
                alert('Appointment updated successfully!');
                setSelectedAppointment(null);
                setUpdatedAppointment({});
                setActiveTab('calendar'); // Redirect back to the calendar tab
            } else {
                alert('Failed to update appointment.');
            }
        } catch (error) {
            console.error('Error updating appointment:', error);
            alert('Error updating appointment.');
        }
    };

    // Handle deleting an appointment
    const handleDeleteAppointment = async (appointmentId) => {
        if (!window.confirm('Are you sure you want to delete this appointment?')) return;

        try {
            const response = await fetch(`/api/appointments/${appointmentId}?doctorId=${doctorId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Appointment deleted successfully!');
                setSelectedAppointment(null);
                setUpdatedAppointment({});
                setAppointments(appointments.filter((appt) => appt.id !== appointmentId));
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
        <div className="doctor-dashboard">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="logo">Doctor Dashboard</div>
                <button
                    className={activeTab === 'calendar' ? 'active-link' : ''}
                    onClick={() => setActiveTab('calendar')}
                >
                    Calendar
                </button>
                <button
                    className={activeTab === 'add-appointment' ? 'active-link' : ''}
                    onClick={() => setActiveTab('add-appointment')}
                >
                    Add Appointment
                </button>
                <button
                    className={activeTab === 'prescription' ? 'active-link' : ''}
                    onClick={() => setActiveTab('prescription')}
                >
                    Prescriptions
                </button>
                <button
                    className={activeTab === 'messages' ? 'active-link' : ''}
                    onClick={() => setActiveTab('messages')}
                >
                    Message Patients
                </button>
                <button
                    className={activeTab === 'edit-appointments' ? 'active-link' : ''}
                    onClick={() => setActiveTab('edit-appointments')}
                >
                    Edit Appointments
                </button>
                <button
                    className={activeTab === 'lab-tests' ? 'active-link' : ''}
                    onClick={() => setActiveTab('lab-tests')}
                >
                    Lab Test Results
                </button>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="header">
                    <h1>Welcome, {doctorName}</h1>
                    <div className="account">
                        <a href="/profile">Your Profile</a> | <a href="/logout">Log Out</a>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'calendar' && (
                    <div className="dashboard-section">
                        <h2>Upcoming Appointments</h2>
                        <DoctorCalendar doctorId={doctorId} />
                    </div>
                )}
                {activeTab === 'add-appointment' && (
                    <div className="dashboard-section">
                        <h2>Schedule an Appointment</h2>
                        <AddAppointmentForDoctor />
                    </div>
                )}
                {activeTab === 'prescription' && (
                    <div className="dashboard-section">
                        <div className="sub-tabs">
                            <button
                                className={prescriptionSubTab === 'add' ? 'active-link' : ''}
                                onClick={() => setPrescriptionSubTab('add')}
                            >
                                Add Prescription
                            </button>
                            <button
                                className={prescriptionSubTab === 'existing' ? 'active-link' : ''}
                                onClick={() => setPrescriptionSubTab('existing')}
                            >
                                Existing Prescriptions
                            </button>
                        </div>

                        {prescriptionSubTab === 'add' && <AddPrescriptions />}
                        {prescriptionSubTab === 'existing' && <ExistingPrescriptions />}
                    </div>
                )}
                {activeTab === 'messages' && (
                    <div className="dashboard-section">
                        <MessagesPage doctorId={doctorId} />
                    </div>
                )}
                {activeTab === 'edit-appointments' && (
                    <div className="dashboard-section">
                        <h2>Edit Appointments</h2>
                        <div>
                            <label>Select Appointment:</label>
                            <select
                                onChange={(e) =>
                                    setSelectedAppointment(
                                        appointments.find((appt) => appt.id === parseInt(e.target.value))
                                    )
                                }
                            >
                                <option value="">-- Select an Appointment --</option>
                                {appointments.map((appointment) => (
                                    <option key={appointment.id} value={appointment.id}>
                                        {appointment.patient_name} - {new Date(appointment.appointment_time).toLocaleString()}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {selectedAppointment && (
                            <div>
                                <form onSubmit={handleEditSubmit}>
                                    <label>
                                        Appointment Date:
                                        <DatePicker
                                            selected={updatedAppointment.appointment_date ? new Date(updatedAppointment.appointment_date) : null}
                                            onChange={(date) => handleEditChange({ target: { name: 'appointment_date', value: date.toISOString().split('T')[0] } })}
                                            dateFormat="MM/dd/yyyy"
                                            placeholderText="Select a date"
                                            required
                                        />
                                    </label>
                                    <label>
                                        Appointment Time:
                                        <TimePicker
                                            value={updatedAppointment.appointment_time || ''}
                                            onChange={(time) => handleEditChange({ target: { name: 'appointment_time', value: time } })}
                                            disableClock={true}
                                            format="hh:mm a"
                                            required
                                        />
                                    </label>
                                    <label>
                                        Status:
                                        <select
                                            name="status"
                                            value={updatedAppointment.status || ''}
                                            onChange={handleEditChange}
                                            required
                                        >
                                            <option value="">-- Select Status --</option>
                                            <option value="Scheduled">Scheduled</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </label>
                                    <button type="submit">Update Appointment</button>
                                </form>
                                <button
                                    onClick={() => handleDeleteAppointment(selectedAppointment.id)}
                                    style={{ marginTop: '10px', backgroundColor: 'red', color: 'white' }}
                                >
                                    Delete Appointment
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'lab-tests' && (
                    <div className="dashboard-section">
                        <DoctorLabTestResults />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorHomePage;

