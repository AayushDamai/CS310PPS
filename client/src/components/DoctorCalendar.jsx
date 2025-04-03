import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const DoctorCalendar = ({ doctorId }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        console.log('Fetching appointments for doctorId:', doctorId);

        if (!doctorId) {
          console.error('No doctorId provided');
          return;
        }

        const response = await fetch(`/api/getDoctorAppointments?doctorId=${doctorId}`);
        if (!response.ok) {
          console.error('Failed to fetch appointments:', response.statusText);
          return;
        }

        const data = await response.json();
        console.log('Fetched appointments:', data);

        const formattedEvents = data.appointments.map((appointment) => ({
          title: `Patient: ${appointment.patient_name}`,
          start: new Date(appointment.appointment_time),
          end: new Date(new Date(appointment.appointment_time).getTime() + 30 * 60 * 1000), // 30-minute block
          allDay: false,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  if (!doctorId) {
    return <div>Please log in to view your appointments.</div>;
  }

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
      />
    </div>
  );
};

export default DoctorCalendar;
