import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';

const TeacherD = () => {
  const [marksData, setMarksData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [genderPerformance, setGenderPerformance] = useState({ maleAverage: 0, femaleAverage: 0 });
  const [attendanceChartData, setAttendanceChartData] = useState([]);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        // Fetch marks data
        const marksResponse = await axios.get('http://localhost:4000/api/academic/marks');
        setMarksData(marksResponse.data);

        // Fetch attendance data
        const attendanceResponse = await axios.get('http://localhost:4000/api/attendance');
        setAttendanceData(attendanceResponse.data);

        // Calculate gender performance
        const genderPerf = calculateGenderPerformance(marksResponse.data);
        setGenderPerformance(genderPerf);

        // Prepare attendance chart data
        const attendanceChart = prepareAttendanceData(attendanceResponse.data);
        setAttendanceChartData(attendanceChart);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchTeacherData();
  }, []);

  const calculateGenderPerformance = (marksData) => {
    const maleMarks = [];
    const femaleMarks = [];

    marksData.forEach((student) => {
      student.marks.forEach((mark) => {
        if (student.gender === 'Male') {
          maleMarks.push(mark.marks);
        } else if (student.gender === 'Female') {
          femaleMarks.push(mark.marks);
        }
      });
    });

    const calculateAverage = (marks) =>
      marks.length ? marks.reduce((acc, mark) => acc + mark, 0) / marks.length : 0;

    return {
      maleAverage: calculateAverage(maleMarks),
      femaleAverage: calculateAverage(femaleMarks),
    };
  };

  const prepareAttendanceData = (attendanceRecords) => {
    const attendanceByDate = {};

    attendanceRecords.forEach((record) => {
      if (!attendanceByDate[record.date]) {
        attendanceByDate[record.date] = { present: 0, absent: 0 };
      }
      if (record.status === 'Present') {
        attendanceByDate[record.date].present++;
      } else if (record.status === 'Absent') {
        attendanceByDate[record.date].absent++;
      }
    });

    return Object.entries(attendanceByDate).map(([date, counts]) => ({
      date,
      present: counts.present,
      absent: counts.absent,
    }));
  };

  return (
    <div>
      <h1>Teacher Dashboard</h1>

      {/* Gender Performance Chart */}
      <h2>Marks Performance by Gender</h2>
      <Bar
        data={{
          labels: ['Males', 'Females'],
          datasets: [
            {
              label: 'Average Marks',
              data: [genderPerformance.maleAverage, genderPerformance.femaleAverage],
              backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            },
          ],
        }}
      />

      {/* Attendance Chart */}
      <h2>Attendance Tracking</h2>
      <Line
        data={{
          labels: attendanceChartData.map((data) => data.date),
          datasets: [
            {
              label: 'Present',
              data: attendanceChartData.map((data) => data.present),
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
            },
            {
              label: 'Absent',
              data: attendanceChartData.map((data) => data.absent),
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: true,
            },
          ],
        }}
      />
    </div>
  );
};

export default TeacherD;
