import { useState } from 'react';

const PaymentRecords = ({ studentId }) => {
  const [books, setBooks] = useState([
    { id: 1, title: 'KCSE Made Familiar: Mathematics Workbook 2024 (New Edition)', status: 'bought', price: 500, fine: 0, paid: true }, // {{ edit_1 }}
    { id: 2, title: 'Bembea ya Maisha ', status: 'borrowed', price: 600, fine: 100, paid: false }, // {{ edit_2 }} (Updated fine)
    { id: 3, title: 'Secondary Chemistry Form 2', status: 'lost', price: 750, fine: 200, paid: false }, // {{ edit_3 }} (Updated fine)
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

export default PaymentRecords;