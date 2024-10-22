const express = require('express');
const router = express.Router();
const { getCalendarEvents, createCalendarEvent, deleteCalendarEvent } = require('../controllers/calendarController');

// GET all calendar events
router.get('/events', getCalendarEvents);

// POST a new calendar event
router.post('/events', createCalendarEvent);

// DELETE a calendar event
router.delete('/events/:id', deleteCalendarEvent);

module.exports = router;
