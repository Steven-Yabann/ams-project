import React, { useState } from "react";
import axios from 'axios';
import './css_files/create_user.css';

export default function Create_user() {
    const [studentInfo, setStudentInfo] = useState({
        name: '',
        student_email: '',
        gender: '',
    });

    const [employeeInfo, setEmployeeInfo] = useState({
        name: '',
        email: '',
        phone_no: '',
        role: '',
        department: '',
        gender: '',
    });

    const [status, setStatus] = useState('');

    const handleInput = (e, formType) => {
        const { name, value } = e.target;
        if (formType === 'Student') {
            setStudentInfo({
                ...studentInfo,
                [name]: value
            });
        } else if (formType === 'Employee') {
            setEmployeeInfo({
                ...employeeInfo,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            if (status === 'Student') {
                const studentData = {
                    name: studentInfo.name,
                    student_email: studentInfo.student_email,
                    gender: studentInfo.gender,

                    admissionNumber: Math.floor(10000 + Math.random() * 90000) // Example admission number
                };
                console.log("Submitting Student Data:", studentData);
    
                const response = await axios.post('http://localhost:4000/api/admin/student', studentData);
                console.log("Student Submission Response:", response.data);
                alert(response.data.message);
            } else if (status === 'Employee') {
                const employeeData = {
                    name: employeeInfo.name,
                    email: employeeInfo.email,
                    phone_no: employeeInfo.phone_no,
                    role: employeeInfo.role,
                    department: employeeInfo.department,
                    gender: employeeInfo.gender,
                    identification_no: Math.floor(10000 + Math.random() * 90000) // Example identification number
                };
                console.log("Submitting Employee Data:", employeeData);
    
                const response = await axios.post('http://localhost:4000/api/admin/teacher', employeeData);
                console.log("Employee Submission Response:", response.data);
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error encountered:", error);
    
            if (error.response) {
                console.error("Error Response Data:", error.response.data);
                console.error("Error Status Code:", error.response.status);
                console.error("Error Headers:", error.response.headers);
    
                alert(`Error: ${error.response.data.message || 'An error occurred'}`);
            } else {
                console.error("Network/Unknown Error:", error.message);
                alert("Error: Unable to connect to the server.");
            }
        }
    };
    
    

    return (
        <div className="form-container">
            <h1>Create a new user:</h1>
            <select className="select-status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value='Student'>Student</option>
                <option value='Employee'>Employee</option>
            </select>

            {status === 'Student' && (
                <form className="form" onSubmit={handleSubmit}>
                    <h3>Student Information</h3>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={studentInfo.name}
                            onChange={(e) => handleInput(e, 'Student')}
                            className="input-field"
                        />
                    </label>
                    <br />
                    <label>
                        Student Email:
                        <input
                            type="email"
                            name="student_email"
                            value={studentInfo.student_email}
                            onChange={(e) => handleInput(e, 'Student')}
                            className="input-field"
                        />
                    </label>
                    <label>
                        Gender:
                        <select
                            name="gender"
                            value={studentInfo.gender}
                            onChange={(e) => handleInput(e, 'Student')}
                            className="input-field"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </label>
                    <br />

                    <br />
                    <p>Note: Admission Number will be generated automatically.</p>
                    <button type="submit" className="submit-btn">Submit Student</button>
                </form>
            )}

            {status === 'Employee' && (
                <form className="form" onSubmit={handleSubmit}>
                    <h3>Employee Information</h3>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={employeeInfo.name}
                            onChange={(e) => handleInput(e, 'Employee')}
                            className="input-field"
                        />
                    </label>
                    <br />
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={employeeInfo.email}
                            onChange={(e) => handleInput(e, 'Employee')}
                            className="input-field"
                        />
                    </label>
                    <br />
                    <label>
                        Phone Number:
                        <input
                            type="text"
                            name="phone_no"
                            value={employeeInfo.phone_no}
                            onChange={(e) => handleInput(e, 'Employee')}
                            className="input-field"
                        />
                    </label>
                    <br />
                    <label>
                        Role:
                        <select
                            name="role"
                            value={employeeInfo.role}
                            onChange={(e) => handleInput(e, 'Employee')}
                            className="input-field"
                        >
                            <option value="">Select Role</option>
                            <option value="Intern">Intern</option>
                            <option value="Permanent">Permanent</option>
                        </select>
                    </label>
                    <br />
                    <label>
                        Department:
                        <select
                            name="department"
                            value={employeeInfo.department}
                            onChange={(e) => handleInput(e, 'Employee')}
                            className="input-field"
                        >
                            <option value="">Select Department</option>
                            <option value="Maths">Maths</option>
                            <option value="English">English</option>
                            <option value="Science">Science</option>
                            <option value="History">History</option>
                            <option value="Geography">Geography</option>
                        </select>
                    </label>
                    <br />

                    <label>
                        Gender:
                        <select
                            name="gender"
                            value={employeeInfo.gender}
                            onChange={(e) => handleInput(e, 'Employee')}
                            className="input-field"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </label>
                    <br />

                    <p>Note: Identification Number will be generated automatically.</p>
                    <button type="submit" className="submit-btn">Submit Employee</button>
                </form>
            )}
        </div>
    );
}
