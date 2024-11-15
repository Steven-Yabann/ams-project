import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react'; 
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction'; 
import axios from 'axios';  
import '../css_files/update_calender.css';


export default function UpdateCalender() {
    const [events, setEvents] = useState([]);

    // Fetch events from the backend when the component loads
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/api/calendar/events');
                // Map the _id from the backend to the event's id, required by FullCalendar
                const formattedEvents = response.data.map(event => ({
                    id: event._id,  // MongoDB _id becomes the event id
                    title: event.title,
                    date: event.date
                }));
                setEvents(formattedEvents);
            } catch (error) {
                console.error('Error fetching events', error);
            }
        };
        fetchEvents();
    }, []);

    

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
