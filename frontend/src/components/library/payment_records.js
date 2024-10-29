import { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentRecords = ({ studentId }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/books/borrowed/${studentId}`);
        setBooks(response.data.books);
      } catch (error) {
        console.error("Error fetching borrowed books:", error);
      }
    };

    fetchBooks();
  }, [studentId]);

  const handlePayment = async (bookId) => {
    try {
      await axios.put(`/api/books/${bookId}/mark-paid`);
      setBooks(books.map(book => 
        book.id === bookId ? { ...book, paid: true } : book
      ));
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };

  const calculateTotal = (book) => {
    return book.price + book.fine;
  };

  return (
    <div className="payment-table">
      <h2>Student Payment Table</h2>
      <table>
        <thead>
          <tr>
            <th>Book Title</th>
            <th>Status</th>
            <th>Book Price</th>
            <th>Fine</th>
            <th>Total Due</th>
            <th>Paid</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.status}</td>
              <td>${book.price.toFixed(2)}</td>
              <td>${book.fine.toFixed(2)}</td>
              <td>${calculateTotal(book).toFixed(2)}</td>
              <td>{book.paid ? 'Yes' : 'No'}</td>
              <td>
                {!book.paid && (
                  <button onClick={() => handlePayment(book.id)}>Pay Now</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentRecords;
