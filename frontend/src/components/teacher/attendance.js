import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './attendance.css';

const TeacherDashboard = () => {
    const [students, setStudents] = useState([{ admissionNo: '', present: false }]);
    const [admissionNumbers, setAdmissionNumbers] = useState([]);
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Fetch admission numbers on component mount
    useEffect(() => {
        const fetchAdmissionNumbers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/teacher/admission-numbers');
                setAdmissionNumbers(response.data);
            } catch (err) {
                console.error('Error fetching admission numbers:', err);
            }
        };
        fetchAdmissionNumbers();
    }, []);

    const handleAdmissionChange = (index, event) => {
        const newStudents = [...students];
        newStudents[index].admissionNo = event.target.value;
        setStudents(newStudents);
    };

    const handleStatusChange = (index, event) => {
        const newStudents = [...students];
        newStudents[index].present = event.target.checked;
        setStudents(newStudents);
    };

    const handleDateChange = (event) => {
        setDate(event.target.value);
    };

    const addStudent = () => {
        setStudents([...students, { admissionNo: '', present: false }]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);
    
        const teacherId = '64c2fa12e7a12b0abc123456'; // Replace with the actual teacher ID
    
        try {
            console.log("Submitting Date:", date); // Debugging: Log the date
            const response = await axios.post('http://localhost:4000/api/teacher/attendance', {
                teacherId,
                date,
                students,
            });
            console.log('Attendance submitted successfully:', response.data);
            setSuccess(true);
            console.log("Submitting Date:", date);

    
            // Clear the success message after 3 seconds
            setTimeout(() => setSuccess(false), 1000);
    
            // Reset the form fields to their initial state
            setDate('');
            setStudents([{ admissionNo: '', present: false }]);
        } catch (err) {
            console.error('Error submitting attendance:', err);
            setError(err.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };
    
    
    
    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-2"></div>
                <div className="col-md-10">
                    <h2>Attendance Form</h2>
                    <form id="attendance-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="attendance-date">Date</label>
                            <input
                                type="date"
                                id="attendance-date"
                                className="form-control"
                                value={date}
                                onChange={handleDateChange}
                                required
                            />
                        </div>

                        <div className="attendance-form d-flex justify-content-between mt-3">
                            <div><strong>Admission No</strong></div>
                            <div><strong>Status</strong></div>
                        </div>

                        {students.map((student, index) => (
                            <div className="attendance-form d-flex justify-content-between" key={index}>
                                <div>
                                    <select
                                        value={student.admissionNo}
                                        onChange={(e) => handleAdmissionChange(index, e)}
                                        className="form-control"
                                    >
                                        <option value="">Select Admission No</option>
                                        {admissionNumbers.map((admission) => (
                                            <option key={admission.admissionNumber} value={admission.admissionNumber}>
                                                {admission.admissionNumber} - {admission.name}
                                            </option>
                                        ))}
                                    </select>
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

                        <button type="button" className="btn btn-info mt-3" onClick={addStudent}>
                            Add Student
                        </button>

                        <button type="submit" className="btn btn-success mt-3" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Attendance'}
                        </button>
                    </form>

                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                    {success && <div className="alert alert-success mt-3">Attendance submitted successfully!</div>}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
