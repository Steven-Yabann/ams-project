import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentAttendance = ({ studentId }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(`/api/attendance/student/${studentId}`);
        setAttendanceRecords(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch attendance records');
      }
    };

    if (studentId) {
      fetchAttendance();
    }
  }, [studentId]);

  return (
    <div>
      <h2>Attendance Records</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!attendanceRecords.length && !error && <p>No attendance records found.</p>}
      <ul>
        {attendanceRecords.map((record) => (
          <li key={record._id}>
            Date: {new Date(record.date).toLocaleDateString()} - Present: {record.present ? 'Yes' : 'No'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentAttendance;
