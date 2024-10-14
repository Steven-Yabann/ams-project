import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react'; 
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction'; 
import '../css_files/update_calender.css';

export default function UpdateCalender() {
    const [events, setEvents] = useState([
        { title: 'Initial Event', date: '2024-09-16' }
    ]);

    const handleDateClick = (info) => {
        let title = prompt('Enter Event Title:');
        if (title) {
            const newEvent = {
                title: title,
                date: info.dateStr
            };
            setEvents([...events, newEvent]);
        }
    };

    const handleEventClick = (clickInfo) => {
        if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
            clickInfo.event.remove();
        }
    };

    return (
        <div className="calendar-container">
            <h1>Update Calendar</h1>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                editable={true}
            />
        </div>
    );
}
