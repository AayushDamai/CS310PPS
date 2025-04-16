import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const DoctorCalendar = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null); // State to track the selected event
    const doctor_id = localStorage.getItem('userId'); // Retrieve doctor_id from localStorage

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                if (!doctor_id) {
                    console.error('No doctor_id provided');
                    return;
                }

                // Make the API call to fetch appointments
                const response = await fetch(`/api/appointments?doctorId=${doctor_id}`);
                if (!response.ok) {
                    console.error('Failed to fetch appointments:', response.statusText);
                    return;
                }

                const data = await response.json();

                // Format the appointments for the calendar
                const formattedEvents = data.map((appointment) => ({
                    id: appointment.id,
                    title: `Patient: ${appointment.user_name}`,
                    start: new Date(appointment.appointment_time),
                    end: new Date(new Date(appointment.appointment_time).getTime() + 30 * 60 * 1000), // 30-minute block
                    allDay: false,
                    location: appointment.location,
                    status: appointment.status,
                }));
                setEvents(formattedEvents);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();
    }, [doctor_id]);

    if (!doctor_id) {
        return <div>Please log in to view your appointments.</div>;
    }

    const handleEventClick = (event) => {
        setSelectedEvent(event); // Set the selected event to display its details
    };

    const closePopup = () => {
        setSelectedEvent(null); // Close the popup
    };

    return (
        <div style={{ height: '500px' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                eventPropGetter={() => ({
                    style: { backgroundColor: 'blue', color: 'white' },
                })}
                onSelectEvent={handleEventClick} // Handle event click
            />

            {/* Popup for selected event */}
            {selectedEvent && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Appointment Details</h2>
                        <p><strong>Patient Name:</strong> {selectedEvent.title}</p>
                        <p><strong>Start Time:</strong> {selectedEvent.start.toLocaleString()}</p>
                        <p><strong>End Time:</strong> {selectedEvent.end.toLocaleString()}</p>
                        <p><strong>Location:</strong> {selectedEvent.location}</p>
                        <p><strong>Status:</strong> {selectedEvent.status}</p>
                        <button onClick={closePopup}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorCalendar;
