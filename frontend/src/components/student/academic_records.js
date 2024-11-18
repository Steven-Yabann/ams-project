import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Award, BookOpen, Calendar, Download, TrendingUp, Trophy, User } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Badge, Card, Col, Container, Form, Row, Spinner, Table } from 'react-bootstrap';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const StudentMarks = () => {
    const [marksData, setMarksData] = useState({});
    const [studentProfile, setStudentProfile] = useState(null);
    const [overallGPA, setOverallGPA] = useState(0);
    const [subjects, setSubjects] = useState([]);
    const [assessmentTypes, setAssessmentTypes] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedAssessmentType, setSelectedAssessmentType] = useState('all');
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeChart, setActiveChart] = useState('line');
    const [gradeDistribution, setGradeDistribution] = useState([]);
    const reportRef = useRef(null);
    const admissionNumber = sessionStorage.getItem('admissionNumber');
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#4B0082', '#008080'];

    useEffect(() => {
        if (!admissionNumber) {
            setError('Admission number not found. Please login again.');
            setLoading(false);
            return;
        }
        fetchStudentData();
    }, [admissionNumber]);

    const fetchStudentData = async () => {
        try {
            const [profileRes, marksRes] = await Promise.all([
                axios.get(`http://localhost:4000/api/profile/admissionNumber/${admissionNumber}`),
                axios.get(`http://localhost:4000/api/academic/marks/${admissionNumber}`)
            ]);
            setStudentProfile(profileRes.data);
            setMarksData(marksRes.data.marks);
            setOverallGPA(parseFloat(marksRes.data.overallGPA) || 0);
            const subjectsList = [...new Set(marksRes.data.rawMarks.map(mark => mark.subject))];
            const assessmentTypesList = [...new Set(marksRes.data.rawMarks.map(mark => mark.typeofTest))];
            setSubjects(subjectsList);
            setAssessmentTypes(assessmentTypesList);
            const processedChartData = prepareGroupedChartData(marksRes.data.rawMarks, subjectsList, assessmentTypesList);
            setChartData(processedChartData);
            const grades = marksRes.data.rawMarks.map(mark => mark.grade);
            const distribution = calculateGradeDistribution(grades);
            setGradeDistribution(distribution);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching student data:', error);
            setError(error.response?.data?.message || 'Error fetching student data');
            setLoading(false);
        }
    };

    const generatePDF = async () => {
        try {
            const report = reportRef.current;
            const canvas = await html2canvas(report, {
                scale: 2,
                logging: false,
                useCORS: true
            });
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            pdf.save(`${studentProfile.name}_Academic_Report.pdf`);
          } catch (error) {
              console.error('Error generating PDF:', error);
              alert('Error generating PDF report. Please try again.');
          }
      };
  
      const prepareGroupedChartData = (rawMarks, subjectsList, assessmentTypesList) => {
          const groupedData = assessmentTypesList.map(assessmentType => {
              const assessmentData = { name: assessmentType };
              subjectsList.forEach(subject => {
                  const mark = rawMarks.find(m => m.typeofTest === assessmentType && m.subject === subject);
                  assessmentData[subject] = mark ? mark.marks : 0;
              });
              return assessmentData;
          });
          return groupedData;
      };
  
      const calculateGradeDistribution = (grades) => {
          const distribution = {};
          grades.forEach(grade => {
              distribution[grade] = (distribution[grade] || 0) + 1;
          });
          return Object.entries(distribution).map(([grade, count]) => ({ grade, count }));
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
  
      const CustomTooltip = ({ active, payload, label }) => {
          if (active && payload && payload.length) {
              return (
                  <div className="bg-white p-3 rounded shadow-sm">
                      <p className="mb-1"><strong>Assessment: {label}</strong></p>
                      {payload.map((entry, index) => (
                          <p key={index} className="mb-1" style={{ color: entry.color }}>
                              {entry.name}: {entry.value}%
                          </p>
                      ))}
                  </div>
              );
          }
          return null;
      };
  
      const filteredChartData = chartData.filter(data => {
          if (selectedAssessmentType === 'all') return true;
          return data.name === selectedAssessmentType;
      });
  
      const getSubjectsForChart = () => {
          if (selectedSubject === 'all') return subjects;
          return [selectedSubject];
      };
  
      if (loading) {
          return (
              <Container className="d-flex justify-content-center align-items-center min-vh-100">
                  <Spinner animation="border" variant="primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                  </Spinner>
              </Container>
          );
      }
  
      if (error) {
          return (
              <Container className="d-flex justify-content-center align-items-center min-vh-100">
                  <Alert variant="danger" className="text-center shadow-sm">
                      <Alert.Heading>Error</Alert.Heading>
                      <p>{error}</p>
                      <button className="btn btn-primary" onClick={() => window.location.href = '/login'}>
                          Back to Login
                      </button>
                  </Alert>
              </Container>
          );
      }
  
      return (
          <Container fluid className="p-4 bg-light min-vh-100">
              <div ref={reportRef}>
                  {/* Profile Section */}
                  {studentProfile && (
                      <Row className="mb-4">
                          <Col>
                              <Card className="border-0 shadow-sm hover-shadow">
                                  <Card.Body>
                                      <div className="d-flex justify-content-between align-items-center">
                                          <div className="d-flex align-items-center">
                                              <div className="me-4 position-relative">
                                                  <div className="profile-image-container">
                                                      {studentProfile.profilePicture ? (
                                                          <img src={studentProfile.profilePicture} alt="Profile" className="profile-image" />
                                                      ) : (
                                                          <div className="profile-placeholder">
                                                              <User  size={50} />
                                                          </div>
                                                      )}
                                                  </div>
                                                  <Badge bg="success" className="position-absolute bottom-0 end-0 status-badge">
                                                      Active
                                                  </Badge>
                                              </div>
                                              <div>
                                                  <h2 className="mb-1 text-primary">{studentProfile.name}</h2>
                                                  <p className="mb-1 text-muted">
                                                      <strong>Admission No:</strong> {studentProfile.admissionNumber}
                                                  </p>
                                                  <p className="mb-0 text-muted">
                                                      <strong>Class:</strong> {studentProfile.class || 'Not Specified'}
                                                  </p>
                                              </div>
                                          </div>
                                          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={generatePDF}>
                                              <Download size={20} /> Download Report
                                          </button>
                                          </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
                {/* Stats Cards */}
                <Row className="mb-4 g-3">
                    <Col md={3}>
                        <Card className="border-0 shadow-sm hover-shadow h-100">
                            <Card.Body>
                                <div className="d-flex align-items-center">
                                    <div className="rounded-circle p-3 bg-primary bg-opacity-10 me-3">
                                        <Award size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1">Overall GPA</h6>
                                        <h3 className="mb-0 text-primary">{overallGPA.toFixed(2)}</h3>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="border-0 shadow-sm hover-shadow h-100">
                            <Card.Body>
                                <div className="d-flex align-items-center">
                                    <div className="rounded-circle p-3 bg-success bg-opacity-10 me-3">
                                        <BookOpen size={24} className="text-success" />
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1">Total Subjects</h6>
                                        <h3 className="mb-0 text-success">{subjects.length}</h3>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="border-0 shadow-sm hover-shadow h-100">
                            <Card.Body>
                                <div className="d-flex align-items-center">
                                    <div className="rounded-circle p-3 bg-warning bg-opacity-10 me-3">
                                        <Trophy size={24} className="text-warning" />
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1">Best Grade</h6>
                                        <h3 className="mb-0 text-warning">
                                            {Object.values(marksData).flat().reduce((best, current) => best.grade < current.grade ? best : current, { grade: 'E' }).grade}
                                        </h3>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="border-0 shadow-sm hover-shadow h-100">
                            <Card.Body>
                                <div className="d-flex align-items-center">
                                    <div className="rounded-circle p-3 bg-info bg-opacity-10 me-3">
                                        <Calendar size={24} className="text-info" />
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1">Assessments</h6>
                                        <h3 className="mb-0 text-info">{assessmentTypes.length}</h3>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                {/* Charts Section */}
                <Row className="mb-4">
                    <Col>
                        <Card className="border-0 shadow-sm hover-shadow">
                            <Card.Header className="bg-white border-bottom-0 pt-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="d-flex align-items-center">
                                        <TrendingUp size={24} className="text-primary me-2" />
                                        <h5 className="mb-0">Performance Overview</h5>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <Form.Select size="sm" value={activeChart} onChange={(e) => setActiveChart(e.target.value)} className="me-2">
                                            <option value="line">Line Chart</option>
                                            <option value="bar">Bar Chart</option>
                                            <option value="pie">Grade Distribution</option>
                                        </Form.Select>
                                        <Form.Select size="sm" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="me-2">
                                            <option value="all">All Subjects</option>
                                            {subjects.map(subject => (
                                                <option key={subject} value={subject}>{subject}</option>
                                            ))}
                                        </Form.Select>
                                        <Form.Select size="sm" value={selectedAssessmentType} onChange={(e) => setSelectedAssessmentType(e.target.value)}>
                                            <option value="all">All Assessments</option>
                                            {assessmentTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                              ))}
                                              </Form.Select>
                                          </div>
                                      </div>
                                  </Card.Header>
                                  <Card.Body>
                                      <ResponsiveContainer width="100%" height={400}>
                                          {activeChart === 'line' ? (
                                              <LineChart data={filteredChartData}>
                                                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
                                                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                                                  <Tooltip content={<CustomTooltip />} />
                                                  <Legend />
                                                  {getSubjectsForChart().map((subject, index) => (
                                                      <Line key={subject} type="monotone" dataKey={subject} stroke={COLORS[index % COLORS.length]} name={subject} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                                  ))}
                                              </LineChart>
                                          ) : activeChart === 'bar' ? (
                                              <BarChart data={filteredChartData}>
                                                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
                                                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                                                  <Tooltip content={<CustomTooltip />} />
                                                  <Legend />
                                                  {getSubjectsForChart().map((subject, index) => (
                                                      <Bar key={subject} dataKey={subject} fill={COLORS[index % COLORS.length]} name={subject} radius={[5, 5, 0, 0]} />
                                                  ))}
                                              </BarChart>
                                          ) : (
                                              <PieChart>
                                                  <Pie data={gradeDistribution} dataKey="count" nameKey="grade" cx="50%" cy="50%" outerRadius={150} fill="#8884d8" label={({ name, value }) => `${name}: ${value}`}>
                                                      {gradeDistribution.map((entry, index) => (
                                                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                      ))}
                                                  </Pie>
                                                  <Tooltip />
                                                  <Legend />
                                              </PieChart>
                                          )}
                                      </ResponsiveContainer>
                                  </Card.Body>
                              </Card>
                          </Col>
                      </Row>
                      {/* Detailed Marks Table */}
                      <Row>
                          <Col>
                              <Card className="border-0 shadow-sm hover-shadow">
                                  <Card.Header className="bg-white border-bottom-0 pt-4">
                                      <div className="d-flex justify-content-between align-items-center">
                                          <div className="d-flex align-items-center">
                                              <BookOpen size={24} className="text-primary me-2" />
                                              <h5 className="mb-0">Detailed Marks</h5>
                                          </div>
                                          <div className="d-flex align-items-center gap-3">
                                              <div className="d-flex align-items-center">
                                                  <span className="me-2 text-muted">Average:</span>
                                                  <Badge bg="primary" className="px-3 py-2 rounded-pill">
                                                      {(Object.values(marksData).flat().reduce((acc, curr) => acc + curr.marks, 0) / (Object.values(marksData).flat().length || 1)).toFixed(1)}%
                                                  </Badge>
                                              </div>
                                              <div className="d-flex align-items-center">
                                                  <span className="me-2 text-muted">Total Records:</span>
                                                  <Badge bg="secondary" className="px-3 py-2 rounded-pill">
                                                      {Object.values(marksData).flat().length}
                                                  </Badge>
                                              </div>
                                          </div>
                                      </div>
                                  </Card.Header>
                                  <Card.Body className="px-0 pb-0">
                                      <div className="table-responsive">
                                          <Table hover className="align-middle mb-0">
                                              <thead className="bg-light">
                                                  <tr>
                                                      <th className="border-0 px-4">Subject</th>
                                                      <th className="border-0">Test Type</th>
                                                      <th className="border-0">Marks</th>
                                                      <th className="border-0">Grade</th>
                                                      <th className="border-0">GPA</th>
                                                      <th className="border-0">Status</th>
                                                  </tr>
                                              </thead>
                                              <tbody>
                                                  {Object.entries(marksData).map(([subject, marks]) => {
                                                      if (selectedSubject === 'all' || selectedSubject === subject) {
                                                          return marks.map((mark, index) => {

                                                                if (selectedAssessmentType === 'all' || selectedAssessmentType === mark.typeofTest) {
                                                                  return (
                                                                      <tr key={`${subject}-${index}`} className="hover-row">
                                                                          <td className="px-4">
                                                                              <div className="d-flex align-items-center">
                                                                                  <div className="rounded-circle p-2 bg-primary bg-opacity-10 me-2">
                                                                                      <BookOpen size={16} className="text-primary" />
                                                                                  </div>
                                                                                  <span className="fw-medium">{subject}</span>
                                                                              </div>
                                                                          </td>
                                                                          <td>
                                                                              <Badge bg="info" className="bg-opacity-10 text-info px-3 py-2 rounded-pill">
                                                                                  {mark.typeofTest}
                                                                              </Badge>
                                                                          </td>
                                                                          <td>
                                                                              <div className="d-flex align-items-center">
                                                                                  <div className="me-2 fw-medium">{mark.marks}%</div>
                                                                                  <div className="progress flex-grow-1 bg-light" style={{ height: '6px', width: '100px' }}>
                                                                                      <div className="progress-bar bg-primary" style={{ width: `${mark.marks}%`, transition: 'width 0.5s ease-in-out' }} />
                                                                                  </div>
                                                                              </div>
                                                                          </td>
                                                                          <td>
                                                                              <Badge bg={getGradeColor(mark.grade)} className="px-3 py-2 rounded-pill">
                                                                                  {mark.grade}
                                                                              </Badge>
                                                                          </td>
                                                                          <td>
                                                                              <strong className="text-primary">{mark.GPA.toFixed(2)}</strong>
                                                                          </td>
                                                                          <td>
                                                                              <Badge bg={mark.marks >= 50 ? 'success' : 'danger'} className={`bg-opacity-10 ${mark.marks >= 50 ? 'text-success' : 'text-danger'} px-3 py-2 rounded-pill`}>
                                                                                  {mark.marks >= 50 ? 'PASSED' : 'FAILED'}
                                                                              </Badge>
                                                                          </td>
                                                                      </tr>
                                                                  );
                                                              }
                                                              return null;
                                                          });
                                                      }
                                                      return null;
                                                  })}
                                              </tbody>
                                          </Table>
                                      </div>
                                  </Card.Body>
                              </Card>
                          </Col>
                      </Row>
                  </div>
                  <style jsx>{`
                      .hover-shadow:hover {
                          transform: translateY(-2px);
                          transition: all 0.3s ease;
                          border: 1px solid #007bff;
                      }
                      .hover-row:hover {
                          background-color: #f8f9fa;
                      }
                      .profile-image-container {
                          width: 100px;
                          height: 100px;
                          border-radius: 50%;
                          border: 4px solid #007bff;
                          overflow: hidden;
                          background-color: #f8f9fa;
                      }
                      .profile-image {
                          width: 100%;
                          height: 100%;
                          object-fit: cover;
                      }
                      .profile-placeholder {
                          width: 100%;
                          height: 100%;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          background-color: #f8f9fa;
                      }
                      .status-badge {
                          transform: translate(25%, 25%);
                          border-radius: 20px;
                          padding: 0.5rem 0.75rem;
                      }
                      .progress {
                          border-radius: 10px;
                          overflow: hidden;
                      }
                      .progress-bar {
                          border-radius: 10px;
                      }
                  `}</style>
              </Container>
          );
      };
      
      export default StudentMarks;