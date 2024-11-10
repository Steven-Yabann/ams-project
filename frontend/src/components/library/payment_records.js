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
            <th>Image</th> {/* Added image column */}
            <th>Book Title</th>
            <th>Author</th>
            <th>Status</th>
            <th>Book Price (KES)</th>
            <th>Fine (KES)</th>
            <th>Total Due (KES)</th>
            <th>Paid</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id}>
              <td><img src={book.image} alt={book.title} style={{ width: '50px', height: 'auto' }} /></td> {/* Display book image */}
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.status}</td>
              <td>{book.price.toLocaleString()} KES</td>
              <td>{book.fine.toLocaleString()} KES</td>
              <td>{calculateTotal(book).toLocaleString()} KES</td>
              <td>{book.paid ? 'Yes' : 'No'}</td> {/* Show payment status */}
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