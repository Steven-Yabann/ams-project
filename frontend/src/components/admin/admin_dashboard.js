import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css_files/AdminDashboard.css'; // Import CSS file for styling

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        studentsCount: 0,
        teachersCount: 0,
        usersCount: 0,
        booksCount: 0,
        recentUsers: []
    });
    const [loading, setLoading] = useState(true);

    // Fetch dashboard statistics
    const fetchStats = async () => {
        try {
            const { data } = await axios.get('http://localhost:4000/api/admin/dashboard-stats');
            setStats(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return <p>Loading dashboard data...</p>;
    }

    // Data for the bar chart
    const chartData = [
        { name: 'Students', count: stats.studentsCount },
        { name: 'Teachers', count: stats.teachersCount },
        { name: 'Total Users', count: stats.usersCount },
        { name: 'Books', count: stats.booksCount } // Add books count to chart
    ];

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
            </div>

            <div className="chart-container">
                <h2>Overview</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#4CAF50" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="recent-users">
                <h2>Recently Created Users</h2>
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Admission Number</th>
                            <th>User Category</th>
                            <th>Creation Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.recentUsers.map(user => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.admissionNumber}</td>
                                <td>{user.userCategory}</td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
