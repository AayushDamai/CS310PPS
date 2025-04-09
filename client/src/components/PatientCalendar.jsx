import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const PatientCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // State to track the selected event
  const patient_id = localStorage.getItem('userId'); // Retrieve patient_id from localStorage

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        console.log('Fetching appointments for patient_id:', patient_id);

        if (!patient_id) {
          console.error('No patient_id provided');
          return;
        }

        // Make the API call to fetch appointments
        const response = await fetch(`http://localhost:5000/api/appointments?patientId=${patient_id}`);
        if (!response.ok) {
          console.error('Failed to fetch appointments:', response.statusText);
          return;
        }

        const data = await response.json();
        console.log('Fetched appointments:', data);

        // Format the appointments for the calendar
        const formattedEvents = data.map((appointment) => ({
          id: appointment.id,
          title: `Doctor: ${appointment.doctor_name}`,
          start: new Date(appointment.appointment_time),
          end: new Date(new Date(appointment.appointment_time).getTime() + 30 * 60 * 1000), // 30-minute block
          allDay: false,
          doctorName: appointment.doctor_name,
          status: appointment.status,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [patient_id]);

  if (!patient_id) {
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
          style: { backgroundColor: 'green', color: 'white' },
        })}
        onSelectEvent={handleEventClick} // Handle event click
      />

      {/* Popup for selected event */}
      {selectedEvent && (
        <div className="popup">
          <div className="popup-content">
            <h2>Appointment Details</h2>
            <p><strong>Doctor Name:</strong> {selectedEvent.doctorName}</p>
            <p><strong>Start Time:</strong> {selectedEvent.start.toLocaleString()}</p>
            <p><strong>End Time:</strong> {selectedEvent.end.toLocaleString()}</p>
            <p><strong>Status:</strong> {selectedEvent.status}</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientCalendar;