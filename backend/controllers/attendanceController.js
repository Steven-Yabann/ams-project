const Attendance = require('../models/attendanceModel');

// Get attendance records by studentId
exports.getAttendanceByStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    const attendanceRecords = await Attendance.find({ studentId });

    if (!attendanceRecords.length) {
      return res.status(404).json({ message: 'No attendance records found for this student.' });
    }

    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error('Error retrieving attendance records:', error);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
};
