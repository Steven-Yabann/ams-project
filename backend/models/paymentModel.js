const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    amount: Number,
    paymentDate: Date,
    status: { type: String, enum: ['Completed', 'Outstanding'] },
    description: String,
    relatedBook: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }
});

module.exports = mongoose.model('Payment', paymentSchema);
