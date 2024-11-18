// models/teacherModel.js
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const teacherSchema = new Schema({
    name: { type: String, required: true },
    identification_no: { type: Number, required: true, unique: false },
    email: { type: String, required: true, unique: false },
    phone_no: { type: Number, required: true },
    role: { type: String, required: true },
    department: { type: String, required: true },
    gender: { type: String, required: true },
}, { timestamps: true })

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher

