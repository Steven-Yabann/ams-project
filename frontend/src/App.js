import { useState } from "react";
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import './App.css';

// Admin components
import AdminSettings from './components/admin/admin_settings';
import Create_user from './components/admin/create_user';
import UpdateCalender from './components/admin/update_calendar';
import Verify_fees from './components/admin/verify_fees';

// Global components
import Login from './components/global/login';
import Sidebar from './components/global/sidebar';

// Teacher components
import TeacherDashboard from './components/teacher/attendance';
import Marks from './components/teacher/marks';
import TeacherProfile from './components/teacher/profile';

// Library components
import ManageFines from './components/library/manage_fines';
import PaymentRecords from './components/library/payment_records';
import UpdateBookStatus from './components/library/update_book_status';
import ViewBookRecords from './components/library/view_book_records';

// Student components
import AcademicRecords from './components/student/academic_records';
import LibraryComponent from './components/student/library_components';
import ProfileContent from './components/student/profile_content';
import Attendance from './components/student/student_attendance';

export default function App() {
    const [isAuthenticated, setAuthentication] = useState(false);

    const handle_login = () => {
        setAuthentication(true);
    };

    const userCategory = sessionStorage.getItem('userCategory');

    const ProtectedRoute = ({ children, category }) => {
        if (!isAuthenticated) {
            return <Navigate to="/" />;
        }
        if (userCategory !== category) {
            return <Navigate to="/" />;
        }
        return children;
    };

    return (
        <Router>
            {isAuthenticated ? (
                <div className="main-page">
                    <Sidebar user_cat={userCategory} />
                    <div className="content-area">
                        <Routes>
                            {/* Set default route based on userCategory */}
                            <Route path="/" element={<Navigate to={userCategory === "admin" ? "/create-user" : 
                                                                  userCategory === "library" ? "/update-book-status" : 
                                                                  userCategory === "teacher" ? "/attendance" : 
                                                                  "/student-dashboard"} />} />

                            {/* Admin Routes */}
                            <Route path="/create-user" element={<ProtectedRoute category="admin"><Create_user /></ProtectedRoute>} />
                            <Route path="/verify-fees" element={<ProtectedRoute category="admin"><Verify_fees /></ProtectedRoute>} />
                            <Route path="/update_calender" element={<ProtectedRoute category="admin"><UpdateCalender /></ProtectedRoute>} />
                            <Route path="/admin_settings" element={<ProtectedRoute category="admin"><AdminSettings /></ProtectedRoute>} />

                            {/* Library Routes */}
                            <Route path="/update-book-status" element={<ProtectedRoute category="library"><UpdateBookStatus /></ProtectedRoute>} />
                            <Route path="/manage-fines" element={<ProtectedRoute category="library"><ManageFines /></ProtectedRoute>} />
                            <Route path="/view-book-records" element={<ProtectedRoute category="library"><ViewBookRecords /></ProtectedRoute>} />
                            <Route path="/payment-records" element={<ProtectedRoute category="library"><PaymentRecords /></ProtectedRoute>} />

                            {/* Teacher Routes */}
                            <Route path="/attendance" element={<ProtectedRoute category="teacher"><TeacherDashboard /></ProtectedRoute>} />
                            <Route path="/marks" element={<ProtectedRoute category="teacher"><Marks /></ProtectedRoute>} />

                            {/* Student Routes */}
                            <Route path="/student-dashboard" element={<ProtectedRoute category="student"><ProfileContent /></ProtectedRoute>} />
                            <Route path="/academic_records" element={<ProtectedRoute category="student"><AcademicRecords /></ProtectedRoute>} />
                            <Route path="/student_attendance" element={<ProtectedRoute category="student"><Attendance /></ProtectedRoute>} />
                            <Route path="/library_component" element={<ProtectedRoute category="student"><LibraryComponent /></ProtectedRoute>} />
                        </Routes>
                    </div>
                </div>
            ) : (
                <Login onLogin={handle_login} />
            )}
        </Router>
    );
}
