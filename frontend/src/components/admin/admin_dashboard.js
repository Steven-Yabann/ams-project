import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Tooltip,
    Legend,
    PieChart,
    Pie,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Cell,
    Line,
    LineChart,
} from 'recharts';
import './css_files/AdminDashboard.css';

export default function AdminDashboard() {
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState([]);
    const [loadingMarks, setLoadingMarks] = useState(true);
    const [loadingTeachers, setLoadingTeachers] = useState(true);
    const [loadingStudents, setLoadingStudents] = useState(true);
    const [stats, setStats] = useState({
        studentsCount: 0,
        teachersCount: 0,
        usersCount: 0,
        booksCount: 0,
        recentUsers: [],
        feeStats: {
            totalFeesCollected: 0,
            totalUnpaidFees: 0,
        },
    });
    const [loading, setLoading] = useState(true);
    const [chartType, setChartType] = useState('donut'); // State to track chart type

    const fetchStats = async () => {
        try {
            const { data } = await axios.get('http://localhost:4000/api/admin/dashboard-stats');
            setStats(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            setLoading(false);
        }
    };

    const fetchTeachers = async () => {
        axios.get('http://localhost:4000/api/admin/teachers')
            .then((response) => {
                setTeachers(response.data);
                setLoadingTeachers(false);
            })
            .catch((error) => {
                console.error("Error fetching teachers:", error);
                setLoadingTeachers(false);
            });
    }

    const fetchMarks = async () => {
        axios.get('http://localhost:4000/api/admin/marks')
            .then((response) => {
                setMarks(response.data);
                setLoadingMarks(false);
            })
            .catch((error) => {
                console.error("Error fetching marks data:", error);
                setLoadingMarks(false);
            });
    }

    const fetchStudents = async () => {
        axios.get('http://localhost:4000/api/admin/students')
            .then((response) => {
                setStudents(response.data);
                setLoadingStudents(false);
            })
            .catch((error) => {
                console.error("Error fetching students:", error);
                setLoadingStudents(false);
            });
    }

    const transformedData = marks.map((mark) => ({
        typeofTest: mark._id.typeofTest,
        subject: mark._id.subject,
        average: mark.averageMarks,
        highest: mark.highestMarks,
        lowest: mark.lowestMarks,
    }));

    useEffect(() => {
        fetchStats();
        fetchTeachers();
        fetchStudents();
        fetchMarks();
    }, []);

    if (loading) {
        return <p>Loading dashboard data...</p>;
    }

    const feeData = [
        { name: 'Paid Fees', value: stats.feeStats.totalFeesCollected },
        { name: 'Unpaid Fees', value: stats.feeStats.totalUnpaidFees },
    ];


    const combinedAdmissions = [];
    const studentData = stats.studentAdmissions.map((entry) => ({
        date: entry._id,
        students: entry.count,
        teachers: 0,
    }));

    const teacherData = stats.teacherAdmissions.map((entry) => ({
        date: entry._id,
        students: 0,
        teachers: entry.count,
    }));

    const admissionMap = {};

    [...studentData, ...teacherData].forEach((entry) => {
        if (!admissionMap[entry.date]) {
            admissionMap[entry.date] = { date: entry.date, students: 0, teachers: 0 };
        }
        admissionMap[entry.date].students += entry.students;
        admissionMap[entry.date].teachers += entry.teachers;
    });

    Object.values(admissionMap)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .forEach((entry) => combinedAdmissions.push(entry));

    return (
        <div className="admin-dashboard">

            <header className="dashboard-header">
                <h1>Admin Dashboard</h1>
            </header>

            <div className="stats-container">
                <div className="stat-box">
                    <h3>Total Students</h3>
                    <p>{stats.studentsCount}</p>
                </div>
                <div className="stat-box">
                    <h3>Total Teachers</h3>
                    <p>{stats.teachersCount}</p>
                </div>
                <div className="stat-box">
                    <h3>Total Users</h3>
                    <p>{stats.usersCount}</p>
                </div>
                <div className="stat-box">
                    <h3>Total Books</h3>
                    <p>{stats.booksCount}</p>
                </div>
                <div className="stat-box">
                    <h3>Total Fees Paid</h3>
                    <p>{stats.feeStats.totalFeesCollected}
                        /60000</p>
                </div>
            </div>

            <div className="charts-row">
                <div className="chart-container line-chart">
                    <h2>Admissions Over Time (Line Graph)</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={combinedAdmissions}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="students" stroke="#4CAF50" name="Students" />
                            <Line type="monotone" dataKey="teachers" stroke="#FF7043" name="Teachers" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="charts-row">
                    <div className="chart-container">
                        <h2>Fee Data ({chartType === 'donut' ? 'Donut Chart' : 'Bar Chart'})</h2>
                        <ResponsiveContainer width="100%" height={400}>
                            {chartType === 'donut' ? (
                                <PieChart>
                                    <Pie
                                        data={feeData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius="40%"
                                        outerRadius="70%"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {feeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#4CAF50' : '#FF7043'} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            ) : (
                                <BarChart data={feeData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#82ca9d" />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="chart-container">
                <h2>Exam Marks Data (Bar Graph)</h2>
                {loadingMarks ? (
                    <p>Loading marks data...</p>
                ) : (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="subject" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="average" fill="#8884d8" name="Average Marks" />
                            <Bar dataKey="highest" fill="#82ca9d" name="Highest Marks" />
                            <Bar dataKey="lowest" fill="#ff8042" name="Lowest Marks" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            <div className="table-container">
                <h2>Teachers</h2>
                {loadingTeachers ? (
                    <p>Loading teachers...</p>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Role</th>
                                <th>Department</th>
                                <th>Gender</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.map((teacher) => (
                                <tr key={teacher._id}>
                                    <td>{teacher.name}</td>
                                    <td>{teacher.email}</td>
                                    <td>{teacher.phone_no}</td>
                                    <td>{teacher.role}</td>
                                    <td>{teacher.department}</td>
                                    <td>{teacher.gender}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="table-container">
                <h2>Students</h2>
                {loadingStudents ? (
                    <p>Loading students...</p>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Admission Number</th>
                                <th>Email</th>
                                <th>Gender</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student._id}>
                                    <td>{student.name}</td>
                                    <td>{student.admissionNumber}</td>
                                    <td>{student.student_email}</td>
                                    <td>{student.gender}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            
        </div>


    );
}
