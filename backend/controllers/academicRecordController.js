const AcademicRecord = require('../models/academicRecordModel');
const Student = require('../models/studentModel');

// Get academic records for a student
const getStudentAcademicRecords = async (req, res) => {
  console.log("Received dtata", req.body)
  try {
    const { studentId, academicYear, term } = req.query;
    
    // First verify if student exists
    const student = await Student.findByIdsss(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find all academic records for the student
    const query = { student_id: studentId };
    if (academicYear) query.academicYear = academicYear;
    if (term) query.term = term;

    const records = await AcademicRecord.find(query);
    
    res.status(200).json({
      student: {
        name: student.name,
        admissionNo: student.adm_no,
        class: student.class // Assuming you add class field to student model
      },
      academicRecords: records
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching academic records", error: error.message });
  }
};

// Add academic record
const addAcademicRecord = async (req, res) => {
  try {
    const { student_id, subject, test1, test2, test3, exam, academicYear, term } = req.body;

    // Verify student exists
    const student = await Student.findById(student_id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if record already exists
    const existingRecord = await AcademicRecord.findOne({
      student_id,
      subject,
      academicYear,
      term
    });

    if (existingRecord) {
      return res.status(400).json({ message: "Academic record already exists for this subject in the given term" });
    }

    const newRecord = new AcademicRecord({
      student_id,
      subject,
      test1,
      test2,
      test3,
      exam,
      academicYear,
      term
    });

    await newRecord.save();
    res.status(201).json({ message: "Academic record added successfully", record: newRecord });
  } catch (error) {
    res.status(500).json({ message: "Error adding academic record", error: error.message });
  }
};

// Update academic record
const updateAcademicRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    const updates = req.body;

    const record = await AcademicRecord.findById(recordId);
    if (!record) {
      return res.status(404).json({ message: "Academic record not found" });
    }

    Object.keys(updates).forEach(key => {
      record[key] = updates[key];
    });

    await record.save();
    res.status(200).json({ message: "Academic record updated successfully", record });
  } catch (error) {
    res.status(500).json({ message: "Error updating academic record", error: error.message });
  }
};

module.exports = {
  getStudentAcademicRecords,
  addAcademicRecord,
  updateAcademicRecord
};