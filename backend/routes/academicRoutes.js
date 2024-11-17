const express = require('express');
const router = express.Router();
const { 
    getStudentMarks,
    getStudentProfile,
    getStudentSubjects,
    updateProfilePicture
} = require('../controllers/academicController');

// Route to get marks for a specific student
router.get('/marks/:studentId', getStudentMarks);

// Route to get student profile
router.get('/profile/:studentId', getStudentProfile);

// Route to get student's subjects
router.get('/subjects/:studentId', getStudentSubjects);

router.get('/admissionNumber/:admissionNumber/picture', updateProfilePicture); 

module.exports = router;