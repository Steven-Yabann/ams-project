import axios from 'axios';
import { Award, BookOpen, Target, Trophy } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Badge, Card, Col, Container, Row, Table } from 'react-bootstrap';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import './studentmarks.css';

const StudentMarks = () => {
    const [marksData, setMarksData] = useState({});
    const [studentProfile, setStudentProfile] = useState(null);
    const [overallGPA, setOverallGPA] = useState(0);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [chartData, setChartData] = useState([]);

    // Assuming we get studentId from authentication context or props
    const admissionNumber = sessionStorage.getItem('admissionNumber');
 // Replace with actual student ID

    useEffect(() => {
        fetchStudentData();
    }, []);

    const fetchStudentData = async () => {
        try {
            const [profileRes, marksRes] = await Promise.all([
                axios.get(`http://localhost:4000/api/academic/profile/${admissionNumber}`),
                axios.get(`http://localhost:4000/api/academic/marks/${admissionNumber}`)
            ]);

            setStudentProfile(profileRes.data);
            setMarksData(marksRes.data.marks);
            setOverallGPA(marksRes.data.overallGPA);
            
            // Prepare chart data
            const chartData = prepareChartData(marksRes.data.rawMarks);
            setChartData(chartData);

            // Extract unique subjects
            const subjectsList = Object.keys(marksRes.data.marks);
            setSubjects(subjectsList);
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    };

    const prepareChartData = (rawMarks) => {
        return rawMarks.map(mark => ({
            subject: mark.subject,
            marks: mark.marks,
            grade: mark.grade,
            testType: mark.typeofTest
        }));
    };

    const getGradeColor = (grade) => {
        const colors = {
            'A': 'success',
            'B': 'primary',
            'C': 'info',
            'D': 'warning',
            'E': 'danger'
        };
        return colors[grade] || 'secondary';
    };

    return (
        <Container fluid className="student-marks-container">
            {studentProfile && (
                <Row className="mb-4">
                    <Col>
                        <Card className="profile-card">
                            <Card.Body>
                                <div className="d-flex align-items-center">
                                    <BookOpen size={24} className="me-2" />
                                    <div>
                                        <h2>{studentProfile.name}</h2>
                                        <p className="mb-0">Admission No: {studentProfile.admissionNumber}</p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            <Row className="mb-4">
                <Col md={4}>
                    <Card className="metric-card">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <Award size={24} className="me-2" />
                                <div>
                                    <h6>Overall GPA</h6>
                                    <h3>{overallGPA}</h3>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="metric-card">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <Trophy size={24} className="me-2" />
                                <div>
                                    <h6>Total Subjects</h6>
                                    <h3>{subjects.length}</h3>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="metric-card">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <Target size={24} className="me-2" />
                                <div>
                                    <h6>Best Grade</h6>
                                    <h3>{chartData.reduce((best, current) => 
                                        best.grade < current.grade ? best : current, 
                                        { grade: 'E' }
                                    ).grade}</h3>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Header>
                            <h5>Performance Overview</h5>
                        </Card.Header>
                        <Card.Body>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="subject" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="marks" stroke="#8884d8" />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h5>Detailed Marks</h5>
                            <select 
                                className="form-select w-auto" 
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                            >
                                <option value="all">All Subjects</option>
                                {subjects.map(subject => (
                                    <option key={subject} value={subject}>{subject}</option>
                                ))}
                            </select>
                        </Card.Header>
                        <Card.Body>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Test Type</th>
                                        <th>Marks</th>
                                        <th>Grade</th>
                                        <th>GPA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(marksData).map(([subject, marks]) => {
                                        if (selectedSubject === 'all' || selectedSubject === subject) {
                                            return marks.map((mark, index) => (
                                                <tr key={`${subject}-${index}`}>
                                                    <td>{subject}</td>
                                                    <td>{mark.typeofTest}</td>
                                                    <td>{mark.marks}</td>
                                                    <td>
                                                        <Badge bg={getGradeColor(mark.grade)}>
                                                            {mark.grade}
                                                        </Badge>
                                                    </td>
                                                    <td>{mark.GPA}</td>
                                                </tr>
                                            ));
                                        }
                                        return null;
                                    })}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default StudentMarks;