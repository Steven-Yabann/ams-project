const Book = require('../models/bookModel');

// Function to add a new book
const addBook = async (req, res) => {
    console.log("handlebook func: ", req.body)
    try {
        const {
            title, author, isbn, publisher, yearPublished, category, location, totalCopies, copiesAvailable, status
        } = req.body;
        
        const newBook = new Book({
            title,
            author,
            isbn,
            publisher,
            yearPublished,
            category,
            location,
            totalCopies,
            copiesAvailable,
            status
        });

        await newBook.save();
        res.status(201).json({ message: "Book added successfully", book: newBook });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation error", error: error.errors });
        } else if (error.code === 11000) {
            return res.status(400).json({ message: "Duplicate ISBN error", error });
        }
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Function to retrieve all books
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json({ books });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Function to retrieve a single book by ISBN
const getBookByISBN = async (req, res) => {
    const { isbn } = req.params;
    try {
        const book = await Book.findOne({ isbn });
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ book });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

//Function to update book Status
const updateBookStatus = async (req, res) => {
    const { isbn } = req.params;
    const { status, borrowedBy, dueDate } = req.body;
    try {
        const book = await Book.findOneAndUpdate(
            { isbn },
            { status, borrowedBy, dueDate },
            { new: true }
        );
        if (!book) return res.status(404).json({ message: "Book not found" });
        res.status(200).json({ message: "Book status updated", book });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

//Function to get borrowed books
const getBorrowedBooks = async (req, res) => {
    try {
        const borrowedBooks = await Book.find({ status: 'Borrowed' });
        const today = new Date();
        
        const booksWithFines = borrowedBooks.map(book => {
            const daysOverdue = (book.dueDate < today) ? Math.ceil((today - book.dueDate) / (1000 * 60 * 60 * 24)) : 0;
            book.fine = daysOverdue * 1; // $1 fine per overdue day
            return book;
        });

        res.status(200).json({ books: booksWithFines });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

//Function to update lost book payment
const updateLostBookPayment = async (req, res) => {
    const { isbn } = req.params;
    const { paymentStatus } = req.body;
    try {
        const book = await Book.findOneAndUpdate(
            { isbn, status: 'Lost' },
            { paymentStatus },
            { new: true }
        );
        if (!book) return res.status(404).json({ message: "Book not found or not marked as lost" });
        res.status(200).json({ message: "Payment status updated", book });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

//Function to get payment records
const getPaymentRecords = async (req, res) => {
    try {
        const payments = await Payment.find().populate('relatedBook');
        res.status(200).json({ payments });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};



module.exports = { addBook, getAllBooks, getBookByISBN , updateBookStatus, getBorrowedBooks, updateLostBookPayment, getPaymentRecords };
