import React, { useState } from "react";
import './marks.css';
const Marks = () => {
  const [marksData, setMarksData] = useState([
    { id: 5678, subject: "Math", marks: 74 },
    { id: 8786, subject: "Chemistry", marks: 65 },
    { id: 4367, subject: "English", marks: 80 },
  ]);

  const [formData, setFormData] = useState({
    id: "",
    subject: "",
    marks: "",
  });

  const subjects = ["Math", "Chemistry", "English", "Physics", "Biology", "History"]; // List of subjects for the dropdown

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddUpdate = () => {
    const existingIndex = marksData.findIndex((data) => data.id === Number(formData.id));

    if (existingIndex !== -1) {
      const updatedMarks = [...marksData];
      updatedMarks[existingIndex] = formData;
      setMarksData(updatedMarks);
    } else {
      setMarksData([...marksData, formData]);
    }
    setFormData({ id: "", subject: "", marks: "" });
  };

  const handleEdit = (data) => {
    setFormData(data);
  };

  const handleDelete = (id) => {
    setMarksData(marksData.filter((data) => data.id !== id));
  };

  return (
    <div className="container">
      <header>
        <h2>Marks Management</h2>
      </header>
      <div className="form-section">
        <input
          type="number"
          placeholder="Admission No"
          name="id"
          value={formData.id}
          onChange={handleInputChange}
        />
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
        <button onClick={handleAddUpdate}>Add/Update Marks</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Admission No</th>
            <th>Subject</th>
            <th>Marks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {marksData.map((data) => (
            <tr key={data.id}>
              <td>{data.id}</td>
              <td>{data.subject}</td>
              <td>{data.marks}</td>
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
