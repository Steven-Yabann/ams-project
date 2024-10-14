
import './App.css';
import { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
//Admin components
import AdminSettings from "./admin_components/admin_settings";
import Create_user from "./admin_components/create_user";
import UpdateCalender from "./admin_components/update_calender";
import Verify_fees from "./admin_components/verify_fees";

//global components
import LogIn from "./global_components/login";
import Sidebar from "./global_components/sidebar";

//teacher components
import TeacherDashboard from "./teacher_components/attendance";
import App from "./teacher_components/marks";

//library components
import ManageFines from "./library_components/manage_fines";
import PaymentRecords from "./library_components/payment_records";
import UpdateBookStatus from "./library_components/update_book_status";
import ViewBookRecords from "./library_components/view_book_records";

//student components
import AcademicRecords from './student_component/academic_records';
import LibraryComponent from './student_component/library_component';
import ProfileContent from './student_component/ProfileContent';
import Attendance from './student_component/Student_attendance';

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
              <Route path="/marks" element={<App/>}/>



              {/* Add more Routes as needed */}
            </Routes>
          </div>
        </div>
      </div>
      ): (
        <LogIn onLogin={handle_login}/>
      )
    }
    </Router>
  )
}
