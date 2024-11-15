const mongoose = require('mongoose');

const testScoreSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    test1: { type: Number, required: true },
    test2: { type: Number, required: true },
    test3: { type: Number, required: true },
    exam: { type: Number, required: true },
    average: { type: Number, required: true },
    finalGrade: { type: String, required: true },
});

const AcademicRecord = mongoose.model('TestScore', testScoreSchema);

module.exports = {
    AcademicRecord,
};