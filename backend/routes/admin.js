const express = require('express');
const router = express.Router();
const { createStudent, createTeacher } = require('../controllers/adminController');

// Route to create a student
router.post('/student', createStudent);

// Route to create a teacher
router.post('/teacher', createTeacher);

module.exports = router;
