const express = require('express');
const router = express.Router();
const { createStudent, createTeacher, getTeacher, dashboardStats } = require('../controllers/adminController');


// Route to create a student
router.post('/student', createStudent);

// router.get('/student', createStudent);

// Route to create a teacher
router.post('/teacher', createTeacher);

router.get('/teacher', getTeacher)

router.get('/dashboard-stats', dashboardStats);


module.exports = router;
