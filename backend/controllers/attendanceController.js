// controllers/attendanceController.js

const Attendance = require('../models/attendanceModel');  // Import the Attendance model

// Controller to get attendance for a specific student
exports.getAttendanceByStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;  // Extract the studentId from the request URL
    
    // Query the database for attendance records of the specific student
    const attendanceRecords = await Attendance.find({ studentId: studentId });
    
    // If no attendance records are found, return a 404 response
    if (!attendanceRecords.length) {
      return res.status(404).json({ message: 'No attendance records found for this student.' });
    }
    
    // Return the attendance records for the student
    res.status(200).json(attendanceRecords);
  } catch (error) {
    // If there's an error, return a 500 error response
    res.status(500).json({ message: 'Error retrieving attendance records.', error });
  }
};

