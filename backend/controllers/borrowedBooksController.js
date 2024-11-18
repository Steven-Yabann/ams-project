// controllers/borrowedBookController.js
const BorrowedBook = require('../models/borrowedBookModel');

const borrowedBookController = {
  // Get borrowed books by student with remaining days
  getStudentBorrowedBooks: async (req, res) => {
    const { studentId } = req.params;
    
    try {
      const borrowedBooks = await BorrowedBook.find({ 
        studentId,
        status: 'Borrowed'  // Only get currently borrowed books
      })
      .populate('bookId', 'title author') // Only get necessary book details
      .populate('studentId', 'name')
      .sort({ borrowDate: -1 });

      // Calculate remaining days for each book
      const booksWithRemainingDays = borrowedBooks.map(book => {
        const today = new Date();
        const returnDate = new Date(book.returnDate);
        const remainingDays = Math.ceil((returnDate - today) / (1000 * 60 * 60 * 24));

        return {
          bookTitle: book.bookId.title,
          author: book.bookId.author,
          borrowDate: book.borrowDate,
          returnDate: book.returnDate,
          remainingDays: remainingDays,
          status: remainingDays < 0 ? 'Overdue' : 'Borrowed'
        };
      });

      res.json(booksWithRemainingDays);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = borrowedBookController;