import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageFines = () => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [lostBooks, setLostBooks] = useState([]);
    const [daysDelayed, setDaysDelayed] = useState(0);
    const [fineAmount, setFineAmount] = useState(0);
    const [bookCost, setBookCost] = useState(0);

    const fetchFinesData = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/books/fines');
            setBorrowedBooks(response.data.borrowedBooks);
            setLostBooks(response.data.lostBooks);
        } catch (error) {
            console.error("Error fetching fine data:", error);
        }
    };

    useEffect(() => {
        fetchFinesData();
    }, []);

    const handleFineCalculation = () => {
        setFineAmount(daysDelayed * 50); // Fine rate, e.g., $50 per day
    };

    const handleBookCostCalculation = () => {
        setBookCost(bookCost * 1.5); // E.g., assume lost book cost is 1.5 times its original price
    };

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
                            <th>Fine Amount</th>
                            <th>Days Delayed</th>
                            <th>Payment Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {borrowedBooks.map((book, index) => (
                            <tr key={index}>
                                <td>{book.title}</td>
                                <td>{book.status}</td>
                                <td>${book.fine.toFixed(2)}</td>
                                <td>{book.daysDelayed}</td>
                                <td>{book.paid ? 'Paid' : 'Unpaid'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="lost-books">
                <h3>Lost Books</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Book Title</th>
                            <th>Cost</th>
                            <th>Paid</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lostBooks.map((book, index) => (
                            <tr key={index}>
                                <td>{book.title}</td>
                                <td>${book.cost.toFixed(2)}</td>
                                <td>{book.paid ? 'Yes' : 'No'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="calculate-fine">
                <h3>Calculate Fine</h3>
                <label htmlFor="daysDelayed">Number of days delayed</label>
                <input 
                    type="number" 
                    id="daysDelayed" 
                    value={daysDelayed} 
                    onChange={(e) => setDaysDelayed(e.target.value)} 
                    placeholder='No of days delayed'
                />
                <button onClick={handleFineCalculation}>Calculate</button>
                <p>Fine Amount: ${fineAmount.toFixed(2)}</p>
            </div>

            <div className="calculate-book-cost">
                <h3>Calculate Cost of Lost Book</h3>
                <label htmlFor="bookCost">Cost of book lost</label>
                <input 
                    type="number" 
                    id="bookCost" 
                    value={bookCost} 
                    onChange={(e) => setBookCost(e.target.value)} 
                    placeholder='Cost of book lost'
                />
                <button onClick={handleBookCostCalculation}>Calculate Cost to be paid</button>
                <p>Book Cost: ${bookCost.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default ManageFines;
