// routes/attendanceRoutes.js

const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Define the route for fetching attendance by studentId
router.get('/attendance/:studentId', attendanceController.getAttendanceByStudent);

module.exports = router;
