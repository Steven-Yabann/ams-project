import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {

    Tooltip,
    Legend,

    PieChart,
    Pie,
    Cell,

    ResponsiveContainer
} from 'recharts';
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

    // Generate random color
    const getRandomColor = () => {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    };

    // Fetch dashboard statistics
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

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return <p>Loading dashboard data...</p>;
    }

    // Data for bar chart


    const userDistributionData = [
        { name: 'Students', value: stats.studentsCount },
        { name: 'Teachers', value: stats.teachersCount }
    ];




    // Data for donut chart
    const donutData = [
        { name: 'Users', value: stats.usersCount },
        { name: 'Books', value: stats.booksCount }
    ];



    return (
        <div className="admin-dashboard">
        <header className="dashboard-header">
            <h1>Admin Dashboard</h1>
        </header>
    
        {/* Stats Section */}
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
            <h2>Teacher-Student Distribution</h2>
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie
                        data={userDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius="40%"
                        outerRadius="70%"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {userDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getRandomColor()} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    
        
    
        <div className="chart-container">
            <h2>User and Book Proportions</h2>
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie
                        data={donutData}
                        cx="50%"
                        cy="50%"
                        innerRadius="40%"
                        outerRadius="70%"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {donutData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getRandomColor()} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    
        
    </div>
    
    );
}
