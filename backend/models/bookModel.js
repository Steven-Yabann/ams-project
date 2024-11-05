const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    publisher: {
        type: String,
        required: true
    },
    yearPublished: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    totalCopies: {
        type: Number,
        required: true
    },
    copiesAvailable: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Available', 'Borrowed', 'Lost', 'Maintenance']
    }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;