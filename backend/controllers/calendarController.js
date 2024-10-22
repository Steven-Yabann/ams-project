const CalendarEvent = require('../models/calendarModel');

// Fetch all events
const getCalendarEvents = async (req, res) => {
    try {
        const events = await CalendarEvent.find({});
        res.status(200).json(events);
    } catch (error) {
        res.status(400).json({ message: "Error fetching events", error });
    }
};

// Create a new event
const createCalendarEvent = async (req, res) => {
    try {
        const { title, date } = req.body;
        const newEvent = new CalendarEvent({ title, date });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ message: "Error creating event", error });
    }
};

// Delete an event
const deleteCalendarEvent = async (req, res) => {
    try {
        const { id } = req.params;
        
        await CalendarEvent.findByIdAndDelete(id);
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error deleting event", error });
    }
};

module.exports = { getCalendarEvents, createCalendarEvent, deleteCalendarEvent }
