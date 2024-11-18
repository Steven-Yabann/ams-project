const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Route to get attendance by studentId
router.get('/student/:studentId', attendanceController.getAttendanceByStudent);

module.exports = router;
