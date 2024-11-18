import React, { useState, useEffect } from "react";
import axios from "axios";
import './marks.css';

const Marks = () => {
  const [marksData, setMarksData] = useState([]);
  const [admissionNumbers, setAdmissionNumbers] = useState([]);
  const [formData, setFormData] = useState({
    studentId: "",
    subject: "",
    marks: "",
    typeofTest: ""
  });

  const subjects = ["Math", "Chemistry", "English", "Physics", "Biology", "History"];
  const typeofTests = ["Exam", "Quiz", "Assignment", "Project"];

  useEffect(() => {
    fetchAdmissionNumbers();
    fetchMarksData();
  }, []);

  const fetchAdmissionNumbers = () => {
    axios.get("http://localhost:4000/api/teacher/admission-numbers")
      .then((response) => setAdmissionNumbers(response.data))
      .catch((error) => console.error("Error fetching admission numbers:", error));
  };

  const fetchMarksData = () => {
    axios.get("http://localhost:4000/api/teacher/marks")
      .then((response) => setMarksData(response.data))
      .catch((error) => console.error("Error fetching marks data:", error));
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddUpdate = () => {
    const newData = { 
      ...formData, 
      marks: Number(formData.marks),
      grade: calculateGrade(Number(formData.marks)),
      GPA: calculateGPA(),
    };

    const existingIndex = marksData.findIndex((data) => data.studentId === formData.studentId);

    if (existingIndex !== -1) {
      axios.put(`http://localhost:4000/api/teacher/marks/${formData.studentId}`, newData)
        .then(fetchMarksData)
        .catch((error) => console.error("Error updating marks:", error));
    } else {
      axios.post("http://localhost:4000/api/teacher/marks", newData)
        .then(fetchMarksData)
        .catch((error) => console.error("Error adding marks:", error));
    }

    setFormData({ studentId: "", subject: "", marks: "", typeofTest: "" });
  };

  const handleEdit = (data) => {
    setFormData({
      studentId: data.studentId,
      subject: data.subject,
      marks: data.marks,
      typeofTest: data.typeofTest,
    });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:4000/api/teacher/marks/${id}`)
      .then(() => setMarksData(marksData.filter((data) => data._id !== id)))
      .catch((error) => console.error("Error deleting marks:", error));
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
        <select
          name="studentId"
          value={formData.studentId}
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

        <input
          type="number"
          placeholder="Marks"
          name="marks"
          value={formData.marks}
          onChange={handleInputChange}
        />

        <select
          name="typeofTest"
          value={formData.typeofTest}
          onChange={handleInputChange}
          className="form-control"
        >
          <option value="">Select Assessment Type</option>
          {typeofTests.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <button onClick={handleAddUpdate}>Add/Update Marks</button>
      </div>

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
            <tr key={data._id}>
              <td>{data.studentId}</td>
              <td>{data.subject}</td>
              <td>{data.marks}</td>
              <td>{calculateGrade(data.marks)}</td>
              <td>{data.typeofTest}</td>
              <td>
                <button onClick={() => handleEdit(data)}>Edit</button>
                <button onClick={() => handleDelete(data._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Marks;
