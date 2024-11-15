// models/borrowedBookModel.js
const mongoose = require('mongoose');

const borrowedBookSchema = new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    borrowDate: { type: Date, default: Date.now },
    returnDate: { type: Date },
    status: { type: String, required: true, enum: ['Borrowed', 'Returned', 'Overdue'] },
    fine: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('BorrowedBook', borrowedBookSchema);
