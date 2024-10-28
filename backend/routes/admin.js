const express = require('express');
const router = express.Router();
const { createStudent, createTeacher, getTeacher, getStu } = require('../controllers/adminController');


// Route to create a student
router.post('/student', createStudent);

// router.get('/student', createStudent);

// Route to create a teacher
router.post('/teacher', createTeacher);

router.get('/teacher', getTeacher)

module.exports = router;
