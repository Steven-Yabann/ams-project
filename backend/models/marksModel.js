
// models/marksModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const marksSchema = new Schema(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true }, // Reference to the teacher assigning the marks
    studentId: { type: Number, required: true },
    subject: { type: String, required: true },
    marks: { type: Number, required: true },
    grade: { type: String, required: true },
    GPA: {type:Number, required: true},
    typeofTest:{type:String, required:true},
  },
  { timestamps: true }
);

const Marks = mongoose.model('Marks', marksSchema);
module.exports = Marks;