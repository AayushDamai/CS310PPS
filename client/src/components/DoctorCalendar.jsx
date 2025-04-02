import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const DoctorCalendar = ({ doctorId }) => {
  const localizer = momentLocalizer(require('moment'));
  const [events, setEvents] = useState([]); // State to store calendar events

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        console.log('Fetching appointments for doctorId:', doctorId);

        if (!doctorId) {
          console.error('No doctorId provided');
          return;
        }

        const response = await fetch(`http://localhost:5000/api/appointments?doctorId=${doctorId}`);
        if (!response.ok) {
          console.error('Failed to fetch appointments:', response.statusText);
          return;
        }

        const data = await response.json();
        console.log('Fetched appointments:', data);

        const formattedEvents = data.map((appointment) => ({
          title: `${appointment.patient_name} - ${appointment.status}`,
          start: new Date(appointment.appointment_time),
          end: new Date(new Date(appointment.appointment_time).getTime() + 30 * 60000), // Add 30 minutes
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  return (
    <div style={{ height: 600, margin: '2rem auto', width: '90%' }}>
      <Calendar
        localizer={localizer}
        events={events} // Use fetched events
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        defaultView="week"
        views={['month', 'week', 'day']}
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default DoctorCalendar;
