import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { borrowBook } from '../../../../backend/controllers/libraryController';

const ManageFines = () => {
    const [BorrowedBooks, setBorrowedBooks] = useState([]);

    const fetchFinesData = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/books/borrowed');
            setBorrowedBooks(response.data.borrowedBooks); // Update state with fetched data
            console.log(BorrowedBooks);
        } catch (error) {
            console.error("Error fetching fine data:", error);
        }
    };
    
    

    useEffect(() => {
        fetchFinesData();
    }, []);

    return (
        <div className="content">
            <h2>Manage Fines</h2>
            <div className="borrowed-books">
                <h3>Borrowed Books</h3>
                <table>
    <thead>
        <tr>
            <th>Book Title</th>
            <th>Return Status</th>
            <th>Fine Amount (KES)</th>
            <th>Days Delayed</th>
            <th>Payment Status</th>
            <th>Student</th>
        </tr>
    </thead>
    <tbody>
        {BorrowedBooks.map((book, index) => (
            <tr key={index}>
                <td>{book.bookId?.title || 'N/A'}</td>
                <td>{book.status === 'Returned' ? 'Returned' : 'Not Returned'}</td>
                <td>{book.fineAmount?.toLocaleString() || '0'} KES</td>
                <td>{book.daysDelayed || '0'}</td>
                <td>{book.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid'}</td>
                <td>
                    {book.borrowedBy?.studentNumber?.name || 'Unknown'} <br />
                    ({book.borrowedBy?.studentNumber?.studentNumber || 'N/A'})
                </td>
            </tr>
        ))}
    </tbody>
</table>

            </div>
        </div>
    );
};

export default ManageFines;
