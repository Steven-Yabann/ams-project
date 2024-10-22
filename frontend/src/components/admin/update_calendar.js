import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react'; 
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction'; 
import axios from 'axios';  
import './css_files/update_calender.css';

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

    // Handle date click to add a new event
    const handleDateClick = async (info) => {
        let title = prompt('Enter Event Title:');
        if (title) {
            const newEvent = { title, date: info.dateStr };
            
            try {
                // Save the new event to the backend
                const response = await axios.post('/api/calendar/events', newEvent);
                // Add the saved event (with the generated _id) to the state
                setEvents([...events, { id: response.data._id, title: response.data.title, date: response.data.date }]);
            } catch (error) {
                console.error('Error saving event', error);
            }
        }
    };

    // Handle event click to delete an event
    const handleEventClick = async (clickInfo) => {
        if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'?`)) {
            try {
                // Delete the event from the backend using the event id
                await axios.delete(`/api/calendar/events/${clickInfo.event.id}`);
                // Remove the event from the frontend calendar
                setEvents(events.filter(event => event.id !== clickInfo.event.id));
            } catch (error) {
                console.error('Error deleting event', error);
            }
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
