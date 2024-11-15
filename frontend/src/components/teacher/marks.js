import React, { useState, useEffect } from "react";
import axios from "axios";
import './marks.css';

const Marks = () => {
  const [marksData, setMarksData] = useState([
    { id: 5678, subject: "Math", marks: 74, assessmentType: "Exam" },
    { id: 8786, subject: "Chemistry", marks: 65, assessmentType: "Quiz" },
    { id: 4367, subject: "English", marks: 80, assessmentType: "Assignment" },
  ]);
  
  const [admissionNumbers, setAdmissionNumbers] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    subject: "",
    marks: "",
    assessmentType: ""
  });

  const subjects = ["Math", "Chemistry", "English", "Physics", "Biology", "History"];
  const assessmentTypes = ["Exam", "Quiz", "Assignment", "Project"];

  // Fetch admission numbers from the backend
  useEffect(() => {
    axios.get("http://localhost:4000/api/teacher/admission-numbers")
      .then((response) => {
        setAdmissionNumbers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching admission numbers:", error);
      });
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddUpdate = () => {
    const existingIndex = marksData.findIndex((data) => data.id === Number(formData.id));
    const newData = { ...formData, marks: Number(formData.marks) };

    if (existingIndex !== -1) {
      const updatedMarks = [...marksData];
      updatedMarks[existingIndex] = newData;
      setMarksData(updatedMarks);
    } else {
      setMarksData([...marksData, newData]);
    }

    setFormData({ id: "", subject: "", marks: "", assessmentType: "" });
  };

  const handleEdit = (data) => {
    setFormData(data);
  };

  const handleDelete = (id) => {
    setMarksData(marksData.filter((data) => data.id !== id));
  };

  const calculateGrade = (marks) => {
    if (marks >= 70) return "A";
    if (marks >= 60) return "B";
    if (marks >= 50) return "C";
    if (marks >= 40) return "D";
    return "E";
  };

  const calculateGPA = () => {
    if (marksData.length === 0) return 0;
    const totalPoints = marksData.reduce((acc, data) => {
      const grade = calculateGrade(data.marks);
      let points = 0;
      switch (grade) {
        case "A": points = 4; break;
        case "B": points = 3; break;
        case "C": points = 2; break;
        case "D": points = 1; break;
        default: points = 0;
      }
      return acc + points;
    }, 0);
    return (totalPoints / marksData.length).toFixed(2);
  };

  return (
    <div className="container">
      <header>
        <h2>Marks Management</h2>
        <p>GPA: {calculateGPA()}</p>
      </header>
      <div className="form-section">
        {/* Admission Number Dropdown */}
        <select
          name="id"
          value={formData.id}
          onChange={handleInputChange}
          className="form-control"
        >
          <option value="">Select Admission No</option>
          {admissionNumbers.map((student) => (
            <option key={student._id} value={student.admissionNumber}>
              {student.admissionNumber} - {student.name}
            </option>
          ))}
        </select>

        {/* Subject Dropdown */}
        <select
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          className="form-control"
        >
          <option value="">Select Subject</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>

        {/* Marks Input */}
        <input
          type="number"
          placeholder="Marks"
          name="marks"
          value={formData.marks}
          onChange={handleInputChange}
        />

        {/* Assessment Type Dropdown */}
        <select
          name="assessmentType"
          value={formData.assessmentType}
          onChange={handleInputChange}
          className="form-control"
        >
          <option value="">Select Assessment Type</option>
          {assessmentTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <button onClick={handleAddUpdate}>Add/Update Marks</button>
      </div>

      {/* Marks Table */}
      <table>
        <thead>
          <tr>
            <th>Admission No</th>
            <th>Subject</th>
            <th>Marks</th>
            <th>Grade</th>
            <th>Assessment Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {marksData.map((data) => (
            <tr key={data.id}>
              <td>{data.id}</td>
              <td>{data.subject}</td>
              <td>{data.marks}</td>
              <td>{calculateGrade(data.marks)}</td>
              <td>{data.assessmentType}</td>
              <td>
                <button onClick={() => handleEdit(data)}>Edit</button>
                <button onClick={() => handleDelete(data.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Marks;
