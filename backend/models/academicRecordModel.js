const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const academicRecordSchema = new Schema({
  student_id: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: String, required: true },
  test1: { type: Number, required: true },
  test2: { type: Number, required: true },
  test3: { type: Number, required: true },
  exam: { type: Number, required: true },
  average: { type: Number },
  finalGrade: { type: String },
  academicYear: { type: String, required: true },
  term: { type: String, required: true }
}, { timestamps: true });

// Calculate average and final grade before saving
academicRecordSchema.pre('save', function(next) {
  // Calculate average of tests
  this.average = ((this.test1 + this.test2 + this.test3) / 3).toFixed(2);
  
  // Calculate final grade based on average and exam
  const finalScore = (this.average * 0.4) + (this.exam * 0.6);
  
  if (finalScore >= 90) this.finalGrade = 'A+';
  else if (finalScore >= 85) this.finalGrade = 'A';
  else if (finalScore >= 80) this.finalGrade = 'B+';
  else if (finalScore >= 75) this.finalGrade = 'B';
  else if (finalScore >= 70) this.finalGrade = 'C+';
  else if (finalScore >= 65) this.finalGrade = 'C';
  else if (finalScore >= 60) this.finalGrade = 'D';
  else this.finalGrade = 'F';
  
  next();
});

const AcademicRecord = mongoose.model('AcademicRecord', academicRecordSchema);
module.exports = AcademicRecord;