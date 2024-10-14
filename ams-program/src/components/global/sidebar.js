import { Link } from "react-router-dom";
import "../css_files/sidebar.css";
export default function Sidebar({ user_cat }){
    const render_links = (category) => {
        switch(category){
            case 1:
                return(
                    <>
                        <h2>ADMIN FUNC</h2>
                        <ul>
                        <Link to="/create-user">Create User</Link>
                        <Link to="/verify-fees">Verify Fees</Link>
                        <Link to="/update_calender">Update Calender</Link>
                        <Link to="/admin_settings">Settings</Link>
                        </ul>
                    </>
                )
            case 2:
                return (
                    <>
                       <h2>LIB FUNC</h2>
                        <ul>
                        <Link to="/update-book-status">Update Book Status</Link>
                        <Link to="/manage-fines">Manage Fines</Link>
                        <Link to="/view-book-records">View Book Records</Link>
                        <Link to="/payment-records">Payment Records</Link>
                        </ul> 
                    </>
                )
            case 3:
                return (
                    <>
                        <h2>TEACH FUNC</h2>
                        <ul>
                        <Link to="/attendance">Attendance </Link>
                        <Link to="/marks">Performance</Link>
                        <Link to="/page3">Messages</Link>
                        <Link to="/page4">Profile settings</Link>
                        </ul>
                    </>
                )

            case 4:
                return (
                    
                    <>
                        <h2>STUDENT FUNC</h2>
                        <ul>
                            <Link to="/student-dashboard">Profile</Link>
                            <Link to="/academic_records">Academic Records</Link>
                            <Link to="/Student_attendance">Attendance</Link>
                            <Link to="/library_component">Library</Link>

                        </ul>
                    </>
                )
            default:
                return(
                    <>
                        <h2>ADMIN FUNC</h2>
                        <ul>
                        <Link to="/page1">Adm Function One</Link>
                        <Link to="/page2">Adm Function Two</Link>
                        <Link to="/page3">Adm Function Three</Link>
                        <Link to="/page4">Adm Function Four</Link>
                        </ul>
                    </>
                )    
        }
    }
    return (
        <div className="sidebar">
            {render_links(user_cat)}
        </div>
    )
}
