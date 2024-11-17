import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Attendance = ({ studentId }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch attendance records for the student
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(`/api/attendance/${studentId}`);
        setAttendanceRecords(response.data);
      } catch (err) {
        setError('Failed to load attendance records.');
      }
    };

    fetchAttendance();
  }, [studentId]);

  if (error) return <div>{error}</div>;

  return (
    <div>
      <h3>Attendance Records</h3>
      <ul>
        {attendanceRecords.map((record) => (
          <li key={record._id}>
            Date: {new Date(record.date).toLocaleDateString()} - {record.present ? 'Present' : 'Absent'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Attendance;
