import { AlertCircle, BarChart2, Book, Calendar, Clock, Download, PieChart, RefreshCw, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Row, Spinner, Table } from 'react-bootstrap';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart as RechartsePie, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const BorrowedBooks = ({ studentId }) => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('table');
  const admissionNumber = sessionStorage.getItem('admissionNumber');

  const fetchBorrowedBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/api/borrowedBooks/borrowed-books/${admissionNumber}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setBorrowedBooks(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch borrowed books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const calculateStatistics = () => {
    const total = borrowedBooks.length;
    const overdue = borrowedBooks.filter(book => book.status === 'Overdue').length;
    const active = borrowedBooks.filter(book => book.status === 'Active').length;
    const returned = borrowedBooks.filter(book => book.status === 'Returned').length;

    const mostBorrowedAuthors = borrowedBooks.reduce((acc, book) => {
      acc[book.author] = (acc[book.author] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      overdue,
      active,
      returned,
      mostBorrowedAuthors
    };
  };

  const stats = calculateStatistics();

  const pieData = [
    { name: 'Active', value: stats.active, color: '#28a745' },
    { name: 'Overdue', value: stats.overdue, color: '#dc3545' },
    { name: 'Returned', value: stats.returned, color: '#17a2b8' }
  ];

  const getMonthlyBorrowings = () => {
    const monthlyData = borrowedBooks.reduce((acc, book) => {
      const month = new Date(book.borrowDate).toLocaleString('default', { month: 'short' });
      if (!acc[month]) acc[month] = 0;
      acc[month]++;
      return acc;
    }, {});

    return Object.entries(monthlyData).map(([month, count]) => ({
      month,
      borrowings: count
    }));
  };

  const exportToCSV = () => {
    const headers = ['Title', 'Author', 'Borrow Date', 'Remaining Days', 'Status'];
    const csvData = borrowedBooks.map(book => [
      book.bookTitle,
      book.author,
      new Date(book.borrowDate).toLocaleDateString(),
      book.remainingDays,
      book.status
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'borrowed-books.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Overdue': return 'danger';
      case 'Returned': return 'info';
      default: return 'secondary';
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center p-5">
          <Spinner animation="border" role="status" />
          <p className="mt-2">Loading borrowed books...</p>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="danger">
          <AlertCircle size={20} className="me-2" />
          {error}
        </Alert>
      );
    }

    if (borrowedBooks.length === 0) {
      return (
        <Alert variant="info">
          <Book size={20} className="me-2" />
          No borrowed books found.
        </Alert>
      );
    }

    switch (view) {
      case 'pie':
        return (
          <div style={{ height: '400px' }}>
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
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
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
              <BarChart data={getMonthlyBorrowings()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="borrowings" fill="#8884d8" name="Books Borrowed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return (
          <Table hover responsive>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Borrow Date</th>
                <th>Remaining Days</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {borrowedBooks.map((book, index) => (
                <tr key={index}>
                  <td>
                    <Book size={16} className="me-2" />
                    {book.bookTitle}
                  </td>
                  <td>{book.author}</td>
                  <td>
                    <Calendar size={16} className="me-2" />
                    {new Date(book.borrowDate).toLocaleDateString()}
                  </td>
                  <td>
                    <Clock size={16} className="me-2" />
                    {book.remainingDays} days
                  </td>
                  <td>
                    <Badge bg={getStatusBadgeVariant(book.status)}>
                      {book.status}
                    </Badge>
                  </td>
                </tr>
              ))}
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
                <Book className="me-2" />
                Borrowed Books
              </h4>
            </Col>
            <Col xs="auto">
              <Button variant="outline-secondary" size="sm" onClick={fetchBorrowedBooks} className="me-2">
                <RefreshCw size={16} className="me-1" />
                Refresh
              </Button>
              <Button variant="outline-primary" size="sm" onClick={exportToCSV}>
                <Download size={16} className="me-1" />
                Export CSV
              </Button>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          <Row className="mb-4">
            <Col md={3}>
              <Card className="text-center bg-light">
                <Card.Body>
                  <h6>Total Books</h6>
                  <h3>{stats.total}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center bg-success text-white">
                <Card.Body>
                  <h6>Active</h6>
                  <h3>{stats.active}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center bg-danger text-white">
                <Card.Body>
                  <h6>Overdue</h6>
                  <h3>{stats.overdue}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center bg-info text-white">
                <Card.Body>
                  <h6>Returned</h6>
                  <h3>{stats.returned}</h3>
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
                  Status Chart
                </Button>
                <Button
                  variant={view === 'bar' ? 'primary' : 'outline-primary'}
                  onClick={() => setView('bar')}
                >
                  <BarChart2 size={16} className="me-1" />
                  Monthly Trend
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

export default BorrowedBooks;