// routes/borrowedBookRoutes.js
const express = require('express');
const router = express.Router();
const borrowedBookController = require('../controllers/borrowedBooksController');

// Get student's borrowed books with remaining days
router.get('/borrowed-books/:studentId', borrowedBookController.getStudentBorrowedBooks);

module.exports = router;