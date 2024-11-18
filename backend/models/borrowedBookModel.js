const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BorrowedBookSchema = new Schema({
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    borrowedBy: {
        studentNumber: { type: String, required: true },
        borrowDate: { type: Date, required: true },
        returnDate: { type: Date },
        datetoReturn: { type: Date },
    },
    status: { type: String, enum: ['Borrowed', 'Returned', 'Lost'], default: 'Borrowed' },
    paymentStatus: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
});

module.exports = mongoose.model('BorrowedBook', BorrowedBookSchema);
