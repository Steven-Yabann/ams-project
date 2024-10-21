
import { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';

//Admin components
import AdminSettings from './components/admin/admin_settings';
import Create_user from './components/admin/create_user';
import UpdateCalender from './components/admin/update_calendar';
import Verify_fees from './components/admin/verify_fees';


//global components
import Login from './components/global/login';
import Sidebar from './components/global/sidebar';

//teacher components
import TeacherDashboard from './components/teacher/attendance';
import Marks from './components/teacher/marks';

//library components
import ManageFines from './components/library/manage_fines';
import PaymentRecords from './components/library/payment_records';
import UpdateBookStatus from './components/library/update_book_status';
import ViewBookRecords from './components/library/view_book_records';


//student components
import AcademicRecords from './components/student/academic_records';
import LibraryComponent from './components/student/library_components';
import ProfileContent from './components/student/profile_content';
import Attendance from './components/student/student_attendance';


export default function IndexPage(){

  const [isAuthenticated, setAuthentication] = useState(false)


  const handle_login = () => {
    setAuthentication(true)
  }
  
  
  return (
    <Router>
      {isAuthenticated ? (
        <div className="main-page">
        <div className="main-content">
          <Sidebar user_cat={4} />
          <div className="content-area">
            <Routes>
              <Route path="/update-book-status" element={<UpdateBookStatus/>}/>
              <Route path="/manage-fines" element={<ManageFines/>}/>
              <Route path="/view-book-records" element={<ViewBookRecords/>}/>
              <Route path="/payment-records" element={<PaymentRecords/>}/>
              <Route path="create-user" element={<Create_user />}/>
              <Route path="/verify-fees" element={<Verify_fees />}/>
              <Route path="/update_calender" element={<UpdateCalender />}/>
              <Route path="/admin_settings" element={<AdminSettings />}/>
              <Route path='/attendance' element={<TeacherDashboard />}/>
              <Route path="/student-dashboard" element={<ProfileContent />} />
              <Route path="/academic_records" element={<AcademicRecords />} />
              <Route path="/library_component" element={<LibraryComponent />} />
              <Route path="/Student_attendance" element={<Attendance />} />
              <Route path="/attendance" element={<Attendance />}/>
              <Route path="/marks" element={<Marks/>}/>



              {/* Add more Routes as needed */}
            </Routes>
          </div>
        </div>
      </div>
      ): (
        <Login onLogin={handle_login}/>
      )
    }
    </Router>
  )
}
