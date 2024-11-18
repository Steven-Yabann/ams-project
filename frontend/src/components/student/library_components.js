import React, { useEffect, useState } from 'react';
import axios from 'axios';

const admissionNumber = sessionStorage.getItem('admissionNumber');

const BorrowedBooks = ({ studentId }) => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBorrowedBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:4000/api/borrowedBooks/borrowed-books/${admissionNumber}`);
      setBorrowedBooks(response.data);
    } catch (err) {
      setError('Failed to fetch borrowed books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  if (loading) return <div>Loading borrowed books...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="borrowed-books">
      <h1>Borrowed Books</h1>
      {borrowedBooks.length === 0 ? (
        <p>No borrowed books found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Borrow Date</th>
              <th>Remaining Days</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {borrowedBooks.map((book, index) => (
              <tr key={index}>
                <td>{book.bookTitle}</td>
                <td>{book.author}</td>
                <td>{new Date(book.borrowDate).toLocaleDateString()}</td>
                <td>{book.remainingDays}</td>
                <td
                  style={{
                    color: book.status === 'Overdue' ? 'red' : 'green',
                    fontWeight: 'bold',
                  }}
                >
                  {book.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};


export default BorrowedBooks;