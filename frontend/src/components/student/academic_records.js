import axios from 'axios';
import { LogOut, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const API_BASE_URL = 'http://localhost:4000/api';

const DetailedStudentProfile = ({ student }) => {
  const [profilePicture, setProfilePicture] = useState(null);

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="student-profile bg-white rounded-lg shadow-md p-6">
      <Card.Body>
        <div className="text-center mb-4">
          <div style={{
            width: '150px',
            height: '150px',
            margin: '0 auto',
            borderRadius: '50%',
            border: '4px solid #2563eb',
            overflow: 'hidden'
          }}>
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            ) : (
              <div className="d-flex align-items-center justify-content-center bg-light h-100">
                <User size={64} />
              </div>
            )}
          </div>
          <input type="file" onChange={handlePictureChange} className="mt-2" />
        </div>
        <h2 className="text-2xl font-bold mb-4">{student.name}</h2>
        <p className="mb-2"><strong>Admission No:</strong> {student.admissionNo}</p>
        <p className="mb-4"><strong>Class:</strong> {student.class}</p>
      </Card.Body>
    </Card>
  );
};

const AcademicGraph = ({ data }) => (
  <Card className="mb-8">
    <Card.Body>
      <h2 className="text-xl font-semibold mb-4">Academic Performance</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="subject" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Test 1" fill="#8884d8" />
          <Bar dataKey="Test 2" fill="#82ca9d" />
          <Bar dataKey="Test 3" fill="#ffc658" />
          <Bar dataKey="Exam" fill="#ff7300" />
        </BarChart>
      </ResponsiveContainer>
    </Card.Body>
  </Card>
);

const GradesTable = ({ data }) => (
  <Card>
    <Card.Body>
      <h2 className="text-xl font-semibold mb-4">Detailed Grades</h2>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Test 1</th>
              <th>Test 2</th>
              <th>Test 3</th>
              <th>Average</th>
              <th>Exam</th>
              <th>Final Grade</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td className="font-medium">{row.subject}</td>
                <td>{row.test1}</td>
                <td>{row.test2}</td>
                <td>{row.test3}</td>
                <td>{row.average}</td>
                <td>{row.exam}</td>
                <td className="font-medium">{row.finalGrade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card.Body>
  </Card>
);

const AcademicRecords = () => {
  const [studentData, setStudentData] = useState(null);
  const [academicRecords, setAcademicRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAcademicRecords = async () => {
      try {
        // You'll need to get the studentId from your auth context or URL params
        const studentId = 'your-student-id';
        const response = await axios.get(`${API_BASE_URL}/academic/records`, {
          params: {
            studentId,
            academicYear: '2024', // You might want to make these dynamic
            term: '1'
          }
        });

        setStudentData(response.data.student);
        
        // Transform the academic records for the graph
        const graphData = response.data.academicRecords.map(record => ({
          subject: record.subject,
          'Test 1': record.test1,
          'Test 2': record.test2,
          'Test 3': record.test3,
          'Exam': record.exam
        }));

        setAcademicRecords(response.data.academicRecords);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAcademicRecords();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!studentData) return <div>No data available</div>;

  return (
    <div className="bg-light min-vh-100">
      <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <button className="logout-button bg-white text-blue-600 px-4 py-2 rounded-full flex items-center">
          <LogOut size={20} className="mr-2" />
          Log out
        </button>
      </header>
      
      <main className="container py-4">
        <h1 className="text-3xl font-bold mb-4">Academic Records</h1>
        <div className="row">
          <div className="col-md-4 mb-4">
            <DetailedStudentProfile student={studentData} />
          </div>
          <div className="col-md-8">
            <AcademicGraph data={academicRecords.map(record => ({
              subject: record.subject,
              'Test 1': record.test1,
              'Test 2': record.test2,
              'Test 3': record.test3,
              'Exam': record.exam
            }))} />
            <GradesTable data={academicRecords} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AcademicRecords;