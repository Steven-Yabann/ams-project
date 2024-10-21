const mongoose = require('mongoose')

const Schema = mongoose.Schema

const studentSchema = new Schema({
    name: { type: String, required: true },
    adm_no: { type: String, required: true, unique: true },
    student_identification: { type: String, required: true },
    student_email: { type: String, required: true, unique: true },
    mother_name: { type: String, required: true },
    father_name: { type: String, required: true },
    mother_id: { type: String, required: true },
    father_id: { type: String, required: true },
    mother_email: { type: String, required: true },
    father_email: { type: String, required: true },
}, { timestamps: true })

const Student = mongoose.model('Student', studentSchema);

module.exports = Student
