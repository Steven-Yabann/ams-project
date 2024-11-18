import React, { useState, useEffect } from 'react';
import { Table, Card, Alert, Spinner, Badge, Container, Row, Col, Button } from 'react-bootstrap';
import { Calendar, User, AlertCircle, CheckCircle, XCircle, BarChart2, PieChart, RefreshCw } from 'lucide-react';
import { PieChart as RechartsePie, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StudentAttendance = ({ studentId }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('table'); // 'table', 'pie', 'bar'
  const admissionNumber = sessionStorage.getItem('admissionNumber');

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/attendance/student/${admissionNumber}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setAttendanceRecords(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch attendance records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const calculateStats = () => {
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter(record => record.present).length;
    const absent = total - present;
    const presentPercentage = total ? ((present / total) * 100).toFixed(1) : 0;

    return {
      total,
      present,
      absent,
      presentPercentage
    };
  };

  const stats = calculateStats();

  const pieData = [
    { name: 'Present', value: stats.present, fill: '#28a745' },
    { name: 'Absent', value: stats.absent, fill: '#dc3545' }
  ];

  const getMonthlyAttendance = () => {
    const monthlyData = {};
    attendanceRecords.forEach(record => {
      const month = new Date(record.date).toLocaleString('default', { month: 'short' });
      if (!monthlyData[month]) {
        monthlyData[month] = { present: 0, absent: 0, total: 0 };
      }
      monthlyData[month].total += 1;
      if (record.present) {
        monthlyData[month].present += 1;
      } else {
        monthlyData[month].absent += 1;
      }
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      'Present': data.present,
      'Absent': data.absent
    }));
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center p-5">
          <Spinner animation="border" role="status" />
          <p className="mt-2">Loading attendance records...</p>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="danger" className="m-3">
          <AlertCircle size={20} className="me-2" />
          {error}
        </Alert>
      );
    }

    if (!attendanceRecords.length) {
      return (
        <Alert variant="info" className="m-3">
          <AlertCircle size={20} className="me-2" />
          No attendance records found.
        </Alert>
      );
    }

    switch (view) {
      case 'pie':
        return (
          <div className="text-center" style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsePie>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  label={({ name, value }) => `${name}: ${value}`}
                />
                <Tooltip />
                <Legend />
              </RechartsePie>
            </ResponsiveContainer>
          </div>
        );

      case 'bar':
        return (
          <div style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getMonthlyAttendance()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Present" fill="#28a745" />
                <Bar dataKey="Absent" fill="#dc3545" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return (
          <Table hover responsive className="mt-3">
            <thead className="bg-light">
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Day</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record) => {
                const date = new Date(record.date);
                return (
                  <tr key={record._id}>
                    <td>{date.toLocaleDateString()}</td>
                    <td>
                      <Badge bg={record.present ? 'success' : 'danger'} className="d-flex align-items-center w-75">
                        {record.present ? (
                          <><CheckCircle size={16} className="me-1" /> Present</>
                        ) : (
                          <><XCircle size={16} className="me-1" /> Absent</>
                        )}
                      </Badge>
                    </td>
                    <td>{date.toLocaleDateString('default', { weekday: 'long' })}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        );
    }
  };

  return (
    <Container fluid className="p-4">
      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <h4 className="mb-0">
                <Calendar className="me-2" />
                Attendance Records
              </h4>
            </Col>
            <Col xs="auto">
              <Button variant="outline-secondary" size="sm" onClick={fetchAttendance} className="me-2">
                <RefreshCw size={16} className="me-1" />
                Refresh
              </Button>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          <Row className="mb-4">
            <Col md={3}>
              <Card className="text-center bg-light">
                <Card.Body>
                  <h6>Total Days</h6>
                  <h3>{stats.total}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center bg-success text-white">
                <Card.Body>
                  <h6>Present Days</h6>
                  <h3>{stats.present}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center bg-danger text-white">
                <Card.Body>
                  <h6>Absent Days</h6>
                  <h3>{stats.absent}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center bg-info text-white">
                <Card.Body>
                  <h6>Attendance %</h6>
                  <h3>{stats.presentPercentage}%</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <div className="btn-group">
                <Button
                  variant={view === 'table' ? 'primary' : 'outline-primary'}
                  onClick={() => setView('table')}
                >
                  <User size={16} className="me-1" />
                  Table
                </Button>
                <Button
                  variant={view === 'pie' ? 'primary' : 'outline-primary'}
                  onClick={() => setView('pie')}
                >
                  <PieChart size={16} className="me-1" />
                  Pie Chart
                </Button>
                <Button
                  variant={view === 'bar' ? 'primary' : 'outline-primary'}
                  onClick={() => setView('bar')}
                >
                  <BarChart2 size={16} className="me-1" />
                  Bar Chart
                </Button>
              </div>
            </Col>
          </Row>

          {renderContent()}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StudentAttendance;