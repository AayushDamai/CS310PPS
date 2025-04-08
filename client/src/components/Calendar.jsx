import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useAuth } from '../hooks/AuthContext';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const Calendar = () => {
    const localizer = momentLocalizer(require('moment'));
    const { user } = useAuth();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                if(user.role == 'Patient'){
                    const res = await fetch(`/api/appointments/${user.userId}`);
                    const data = await res.json();

                    const calendarEvents = data
                    .filter(app => app.status === 'Scheduled')
                    .map(app => {
                        const start = new Date(app.appointment_time);
                        const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour default

                        return {
                            title: `${app.doctor_name} @ Location ${app.location}`,
                            start,
                            end,
                            allDay: false,
                            resource: {
                                location: app.location,
                                doctorId: app.doctor_id,
                                appointmentId: app.id,
                            },
                        };
                    });
                }
                else{
                    const res = await fetch(`/api/appointments?user_id=${user.userId}`);
                    const data = await res.json();
                    const calendarEvents = data
                        .filter(app => app.status === 'Scheduled')
                        .map(app => {
                            const start = new Date(app.appointment_time);
                            const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour default

                            return {
                                title: `${app.doctor_name} @ Location ${app.location}`,
                                start,
                                end,
                                allDay: false,
                                resource: {
                                    location: app.location,
                                    doctorId: app.doctor_id,
                                    appointmentId: app.id,
                                },
                            };
                        });
                }

                setEvents(calendarEvents);
            } catch (err) {
                console.error('Failed to fetch appointments:', err);
            }
        };

        fetchAppointments();
    }, [userId]);


    return (
        <div className='calendar-container'>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                titleAccessor="title"
                defaultView="week"
                views={['month', 'week', 'day']}
                style={{ height: '100%' }}
            />
        </div>
    );
}