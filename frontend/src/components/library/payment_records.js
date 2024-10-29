<<<<<<< HEAD
import { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentRecords = ({ studentId }) => {
  const [books, setBooks] = useState([]);
=======
import { useState } from 'react';

const PaymentRecords = ({ studentId }) => {
  const [books, setBooks] = useState([
    { id: 1, title: 'KCSE Made Familiar: Mathematics Workbook 2024 (New Edition)', status: 'bought', price: 500, fine: 0, paid: true }, // {{ edit_1 }}
    { id: 2, title: 'Bembea ya Maisha ', status: 'borrowed', price: 600, fine: 100, paid: false }, // {{ edit_2 }} (Updated fine)
    { id: 3, title: 'Secondary Chemistry Form 2', status: 'lost', price: 750, fine: 200, paid: false }, // {{ edit_3 }} (Updated fine)
  ]);
>>>>>>> 7668b226e33eeb1f3fc862063065cf4e8d1ff8fe

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
            <th>Book Price (KES)</th> {/* {{ edit_4 }} */}
            <th>Fine (KES)</th> {/* {{ edit_5 }} */}
            <th>Total Due (KES)</th> {/* {{ edit_6 }} */}
            <th>Paid</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.status}</td>
              <td>{book.price.toLocaleString()} KES</td> {/* {{ edit_7 }} */}
              <td>{book.fine.toLocaleString()} KES</td> {/* {{ edit_8 }} */}
              <td>{calculateTotal(book).toLocaleString()} KES</td> {/* {{ edit_9 }} */}
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

<<<<<<< HEAD
export default PaymentRecords;
=======
export default PaymentRecords;
>>>>>>> 7668b226e33eeb1f3fc862063065cf4e8d1ff8fe
