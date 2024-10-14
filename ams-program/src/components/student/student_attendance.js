import { Card, Table } from 'react-bootstrap';
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const Attendance = () => {
  const attendanceData = [
    { subject: 'Mathematics', percentage: 98 },
    { subject: 'English', percentage: 78 },
    { subject: 'Kiswahili', percentage: 80 },
    { subject: 'Science', percentage: 90 },
    { subject: 'Social Studies', percentage: 99 },
  ];

  return (
    <div className="container py-4">
      <h1 className="text-3xl font-bold mb-4">Attendance</h1>
      <div className="row">
        <div className="col-md-6 mb-4">
          <Card>
            <Card.Body>
              <h2 className="text-xl font-semibold mb-4">Attendance Table</h2>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Attendance (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.subject}</td>
                      <td>{item.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-6 mb-4">
          <Card>
            <Card.Body>
              <h2 className="text-xl font-semibold mb-4">Attendance Chart</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="percentage" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <ReferenceLine y={66} label="Min Attendance" stroke="red" strokeDasharray="3 3" />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
