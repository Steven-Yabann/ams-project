const express = require('express');
const router = express.Router();

// Importing the controller functions from teachersController.js
const { 
    addMarks, 
    addAttendance, 
    getTeacherProfile, 
    getCalendarDetails 
} = require('../controllers/teachersController');

// Route to add marks for a student
router.post('/marks.js', addMarks);

// Route to add attendance for a student
router.post('/attendance.js', addAttendance);

// Route to get the teacher's profile
router.get('../profile/:id', getTeacherProfile);

// Route to get the teacher's calendar details from another DB
router.get('../calendar/:id', getCalendarDetails);

module.exports = router;
