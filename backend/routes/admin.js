const express = require('express');
const router = express.Router();
const 
{ 
    createStudent, 
    createTeacher, 
    getTeachers, 
    getStudents,
    dashboardStats,
    getMarksData,
    getGenderDistributionStudent,
    getGenderDistributionTeacher,
    updateStudentGender
}   = require('../controllers/adminController');


router.post('/student', createStudent);

router.get('/students', getStudents);

router.post('/teacher', createTeacher);

router.get('/teachers', getTeachers)

router.get('/dashboard-stats', dashboardStats);

router.get('/marks', getMarksData);

router.get('/students/gender-distribution', getGenderDistributionStudent);

router.get('/teachers/gender-distribution', getGenderDistributionTeacher);

router.put('/students/update-gender', updateStudentGender);

module.exports = router;
