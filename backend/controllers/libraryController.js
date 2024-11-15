const Book = require('../models/bookModel');
const BorrowedBook = require('../models/borrowedBookModel');
const Student = require('../models/studentModel');

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

const fetchStudents = async (req, res) => {
    try {
        const { admissionNumber, email, name } = req.query;

        const searchCriteria = {};
        if (admissionNumber) searchCriteria.admissionNumber = admissionNumber;
        if (email) searchCriteria.student_email = email;
        if (name) searchCriteria.name = { $regex: name, $options: 'i' };

        const students = await Student.find(searchCriteria);

        if (students.length === 0) {
            return res.status(404).json({ message: 'No students found' });
        }

        res.status(200).json({ students });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};


const updateBookStatus = async (req, res) => {
    const { borrowedBookId } = req.params;
    const { status, isPaid } = req.body;

    try {
        const borrowedBook = await BorrowedBook.findById(borrowedBookId).populate('bookId');
        if (!borrowedBook) return res.status(404).json({ message: "Borrowed book record not found" });

        // Update status based on provided details
        borrowedBook.status = status;

        if (status === 'Returned') {
            borrowedBook.bookId.copiesAvailable += 1; // Increase available copies
            await borrowedBook.bookId.save();
        } else if (status === 'Lost') {
            borrowedBook.paymentStatus = isPaid ? 'Paid' : 'Unpaid';
        }

        await borrowedBook.save();
        res.status(200).json({ message: "Book status updated", borrowedBook });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};


// Borrow a book
const borrowBook = async (req, res) => {
    const { bookId, studentId, returnDate } = req.body;

    try {
        const book = await Book.findById(bookId);
        if (!book || book.copiesAvailable < 1) {
            return res.status(400).json({ message: "Book not available" });
        }

        // Ensure the student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Create the borrowed book record
        const borrowedBook = new BorrowedBook({
            bookId,
            studentId,
            borrowDate: new Date(),
            returnDate,
            status: 'Borrowed'
        });
        
        await borrowedBook.save();

        // Update available copies for the book
        book.copiesAvailable -= 1;
        await book.save();

        res.status(201).json({ message: "Book borrowed successfully", borrowedBook });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

const getBorrowedBooks = async (req, res) => {
    try {
        const borrowedBooks = await BorrowedBook.find({ status: 'Borrowed' })
            .populate('bookId', 'title author isbn')
            .populate('studentId', 'name admissionNumber student_email');
        
        res.status(200).json({ borrowedBooks });
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

const getPaymentRecords = async (req, res) => {
    try {
        const payments = await BorrowedBook.find({ paymentStatus: 'Unpaid' })
            .populate('bookId', 'title author')
            .populate('studentId', 'name admissionNumber');
        
        res.status(200).json({ payments });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};




module.exports = { addBook, getAllBooks, getBookByISBN , updateBookStatus, borrowBook, getBorrowedBooks, updateLostBookPayment, getPaymentRecords, fetchStudents };
