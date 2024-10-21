const mongoose = require('mongoose')

const Schema = mongoose.Schema

const teacherSchema = new Schema({
    name: { type: String, required: true },
    identification_no: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone_no: { type: Number, required: true },
    role: { type: String, required: true },
    department: { type: String, required: true },
}, { timestamps: true })

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher
