const express = require('express');
const { addBook, getAllBooks, getBookByISBN , updateBookStatus , getBorrowedBooks, updateLostBookPayment, getPaymentRecords, fetchStudents} = require('../controllers/libraryController');
const router = express.Router();

console.log("At library routes");
// Route to add a new book
router.post('/books', addBook);

// Route to get all books
router.get('/books', getAllBooks);

// Route to get a book by ISBN
router.get('/books/:isbn', getBookByISBN);

router.put('/books/:bookId/update', updateBookStatus);

router.get('/fetch-students', fetchStudents);

router.get('/borrowed', getBorrowedBooks);

router.put('/books/:isbn/payment-status', updateLostBookPayment);

router.get('/payments', getPaymentRecords);



module.exports = router;
