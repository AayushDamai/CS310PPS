import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parseISO } from 'date-fns';

const DoctorCalendar = () => {
  const [appointments, setAppointments] = useState([]);
  const localizer = momentLocalizer(require('moment'));

  useEffect(() => {
    const doctorId = localStorage.getItem('userId');
    fetch(`/api/getDoctorAppointments?doctorId=${doctorId}`)
      .then(res => res.json())
      .then(data => {
        const events = data.appointments.map(app => ({
          title: `${app.patient_name} - ${app.status}`,
          start: new Date(app.appointment_time),
          end: new Date(new Date(app.appointment_time).getTime() + 30 * 60000) // +30 mins
        }));
        setAppointments(events);
      });
  }, []);

  return (
    <div style={{ height: 600, margin: '2rem auto', width: '90%' }}>
      <Calendar
        localizer={localizer}
        events={appointments}
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
