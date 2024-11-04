// models/studentModel.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    admissionNumber: { type: String, required: true },
    student_email: { type: String, required: true},
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
