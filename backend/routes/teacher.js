const express = require('express');
const router = express.Router();

// Importing the controller functions from teachersController.js
const { 
    addMarks,
    getMarks,
    deleteMarks,
    addAttendance, 
    getTeacherProfile, 
    getAdmissionNumbers
} = require('../controllers/teachersController');

// Route to add, get and delete marks for a student
router.post('/marks', addMarks);

router.get('/marks', getMarks);

router.delete('/marks/:id', deleteMarks);

// Route to add attendance for a student
router.post('/attendance', addAttendance);

// Route to get the teacher's profile
router.get('/profile/:id', getTeacherProfile);

// Route to get the teacher's calendar details from another DB
// router.get('/calendar/:id', getCalendarDetails);

// Route to get admission details
router.get('/admission-numbers', getAdmissionNumbers);

module.exports=router;
