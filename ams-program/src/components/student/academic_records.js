import { LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { Card } from 'react-bootstrap';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

//Test data
const studentData = {
  admissionNo: '5665',
  name: 'Brandon Kigali',
  class: '7 East',
  subjects: ['Mathematics', 'Science', 'English', 'History', 'Geography'],
};


const graphData = [
  { 
    subject: 'Mathematics',
    'Test 1': 85,
    'Test 2': 90,
    'Test 3': 88,
    'Exam': 92
  },
  { 
    subject: 'Science',
    'Test 1': 78,
    'Test 2': 85,
    'Test 3': 92,
    'Exam': 88
  },
  { 
    subject: 'English',
    'Test 1': 90,
    'Test 2': 87,
    'Test 3': 93,
    'Exam': 95
  },
  { 
    subject: 'History',
    'Test 1': 75,
    'Test 2': 80,
    'Test 3': 82,
    'Exam': 85
  },
  { 
    subject: 'Geography',
    'Test 1': 88,
    'Test 2': 92,
    'Test 3': 85,
    'Exam': 90
  },
];

const tableData = [
  { subject: 'Mathematics', test1: 85, test2: 90, test3: 88, average: 87.67, exam: 92, finalGrade: 'A' },
  { subject: 'Science', test1: 78, test2: 85, test3: 92, average: 85, exam: 88, finalGrade: 'B+' },
  { subject: 'English', test1: 90, test2: 87, test3: 93, average: 90, exam: 95, finalGrade: 'A+' },
  { subject: 'History', test1: 75, test2: 80, test3: 82, average: 79, exam: 85, finalGrade: 'B' },
  { subject: 'Geography', test1: 88, test2: 92, test3: 85, average: 88.33, exam: 90, finalGrade: 'A' },
];

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
        <h3 className="text-lg font-semibold mb-2">Registered Subjects</h3>
        <ul className="list-disc pl-5">
          {student.subjects.map((subject, index) => (
            <li key={index} className="mb-1">{subject}</li>
          ))}
        </ul>
      </Card.Body>
    </Card>
  );
};

const Header = () => (
  <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center mb-8">
    <h1 className="text-2xl font-bold">Student Dashboard</h1>
    <button className="logout-button bg-white text-blue-600 px-4 py-2 rounded-full flex items-center">
      <LogOut size={20} className="mr-2" />
      Log out
    </button>
  </header>
);

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
  return (
    <div className="bg-light min-vh-100">
      <Header />
      <main className="container py-4">
        <h1 className="text-3xl font-bold mb-4">Academic Records</h1>
        <div className="row">
          <div className="col-md-4 mb-4">
            <DetailedStudentProfile student={studentData} />
          </div>
          <div className="col-md-8">
            <AcademicGraph data={graphData} />
            <GradesTable data={tableData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AcademicRecords;
