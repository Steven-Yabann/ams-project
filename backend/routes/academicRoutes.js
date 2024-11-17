const express = require('express');
const router = express.Router();
const { 
    getStudentMarks,
    getStudentProfile,
    getStudentSubjects
} = require('../controllers/academicController');

// Route to get marks for a specific student
router.get('/marks/:studentId', getStudentMarks);

// Route to get student profile
router.get('/profile/:studentId', getStudentProfile);

// Route to get student's subjects
router.get('/subjects/:studentId', getStudentSubjects);

module.exports = router;