import React, { useState } from 'react';
import './attendance.css';

const TeacherDashboard = () => {
    // State to manage the list of students and their attendance status
    const [students, setStudents] = useState([{ admissionNo: '', present: false }]);

    // Handle change for admission number input
    const handleAdmissionChange = (index, event) => {
        const newStudents = [...students];
        newStudents[index].admissionNo = event.target.value;
        setStudents(newStudents);
    };

    // Handle change for attendance status checkbox
    const handleStatusChange = (index, event) => {
        const newStudents = [...students];
        newStudents[index].present = event.target.checked;
        setStudents(newStudents);
    };

    // Handle adding a new student entry
    const addStudent = () => {
        setStudents([...students, { admissionNo: '', present: false }]);
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Attendance submitted:", students);
        // You can add further actions like sending this data to the backend
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-2">
                    
                    
                </div>
                <div className="col-md-10">
                    <h2>Attendance Form</h2>
                    <form id="attendance-form" onSubmit={handleSubmit}>
                        <div className="attendance-form d-flex justify-content-between">
                            <div><strong>Admission No</strong></div>
                            <div><strong>Status</strong></div>
                        </div>

                        {students.map((student, index) => (
                            <div className="attendance-form d-flex justify-content-between" key={index}>
                                <div>
                                    <input 
                                        type="text" 
                                        value={student.admissionNo} 
                                        onChange={(e) => handleAdmissionChange(index, e)} 
                                        placeholder="Enter Admission No" 
                                        className="form-control"
                                    />
                                </div>
                                <div>
                                    <input 
                                        type="checkbox" 
                                        checked={student.present} 
                                        onChange={(e) => handleStatusChange(index, e)} 
                                    /> Present
                                </div>
                            </div>
                        ))}

                        {/* Button to add more student entries */}
                        <button type="button" className="btn btn-info mt-3" onClick={addStudent}>Add Student</button>

                        <button type="submit" className="btn btn-success mt-3">Submit Attendance</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
