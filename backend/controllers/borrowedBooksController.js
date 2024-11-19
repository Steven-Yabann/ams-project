const BorrowedBook = require('../models/borrowedBookModel');
const borrowedBookController = {
  // Get borrowed books by student with remaining days
  getStudentBorrowedBooks: async (req, res) => {
    const { studentId } = req.params;

    try {
      const borrowedBooks = await BorrowedBook.find({
        'borrowedBy.studentNumber': studentId, // Match by nested studentNumber
        status: 'Borrowed',                   // Only include borrowed books
      })
        .populate('bookId', 'title author')   // Populate book details
        .sort({ 'borrowedBy.borrowDate': -1 }); // Sort by borrow date

      if (!borrowedBooks.length) {
        return res.status(404).json({ message: 'No borrowed books found for this student.' });
      }

      // Calculate remaining days for each borrowed book
      const booksWithRemainingDays = borrowedBooks.map(book => {
        const today = new Date();
        const returnDate = new Date(book.borrowedBy.datetoReturn || book.borrowedBy.returnDate);
        const remainingDays = Math.ceil((returnDate - today) / (1000 * 60 * 60 * 24));

        return {
          bookTitle: book.bookId?.title || 'Unknown Title',
          author: book.bookId?.author || 'Unknown Author',
          borrowDate: book.borrowedBy.borrowDate,
          returnDate: book.borrowedBy.returnDate,
          remainingDays: remainingDays,
          status: remainingDays < 0 ? 'Overdue' : 'Borrowed',
          paymentStatus: book.paymentStatus,
        };
      });

      res.json(booksWithRemainingDays);
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = borrowedBookController;
