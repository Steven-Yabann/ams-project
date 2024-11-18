import React, { useState, useEffect } from 'react';
import axios from 'axios';

const admissionNumber = sessionStorage.getItem('admissionNumber');

const StudentAttendance = ({ studentId }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [error, setError] = useState(null);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/attendance/student/${admissionNumber}`);
      console.log(response.data);
      setAttendanceRecords(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch attendance records.');
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>Attendance Records</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {!attendanceRecords.length && !error && <p style={{ textAlign: 'center' }}>No attendance records found.</p>}
      
      {attendanceRecords.length > 0 && (
        <table style={{ width: '80%', margin: '20px auto', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Date</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Present</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record, index) => (
              <tr key={record._id} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td
                  style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                    color: record.present ? 'green' : 'red',
                    fontWeight: 'bold',
                  }}
                >
                  {record.present ? 'Yes' : 'No'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentAttendance;