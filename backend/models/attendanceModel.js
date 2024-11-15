
// models/attendanceModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher', required: false }, // Optional if not always provided
    studentId: { type: Number, required: true },
    date: { type: Date, required: true },
    present: { type: Boolean, required: true },
  },
  { timestamps: true }
);


const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;