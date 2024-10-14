import { useState } from 'react';


const PaymentRecords = ({ studentId }) => {
  const [books, setBooks] = useState([
    { id: 1, title: 'KCSE Made Familiar: Mathematics Workbook 2024 (New Edition)', status: 'bought', price: 50, fine: 0, paid: true },
    { id: 2, title: 'Bembea ya Maisha ', status: 'borrowed', price: 0, fine: 5, paid: false },
    { id: 3, title: 'Secondary Chemistry Form 2', status: 'lost', price: 40, fine: 50, paid: false },
  ]);

  const handlePayment = (bookId) => {
    setBooks(books.map(book => 
      book.id === bookId ? { ...book, paid: true } : book
    ));
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

export default PaymentRecords;
