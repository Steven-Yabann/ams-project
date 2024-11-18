const express = require('express');
const router = express.Router();
const 
{ 
    createStudent, 
    createTeacher, 
    getTeachers, 
    getStudents,
    dashboardStats,
    getMarksData
}   = require('../controllers/adminController');


router.post('/student', createStudent);

router.get('/students', getStudents);

router.post('/teacher', createTeacher);

router.get('/teachers', getTeachers)

router.get('/dashboard-stats', dashboardStats);

router.get('/marks', getMarksData);

module.exports = router;
