import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import axios from 'axios';

=======
//import axion
//import axion 
// import '../css_files/manage_fines.css';
>>>>>>> 7668b226e33eeb1f3fc862063065cf4e8d1ff8fe
const ManageFines = () => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [lostBooks, setLostBooks] = useState([]);
    const [daysDelayed, setDaysDelayed] = useState(0);
    const [fineAmount, setFineAmount] = useState(0);
    const [bookCost, setBookCost] = useState(0);

    const fetchFinesData = async () => {
        try {
<<<<<<< HEAD
            const response = await axios.get('http://localhost:4000/api/books/fines');
            setBorrowedBooks(response.data.borrowedBooks);
=======
            const response = await bookService.calculateFines();
            const updatedFines = response.data.borrowedBooks.map(fine => {
                const daysDelayed = fine.daysDelayed; // Assuming this is available
                const fineRate = 50; // Assuming a fine rate of KES 50 per day delayed
                const calculatedFine = daysDelayed * fineRate;
                return { ...fine, calculatedFine }; // Add calculated fine to each fine object
            });
            setFines(updatedFines);
>>>>>>> 7668b226e33eeb1f3fc862063065cf4e8d1ff8fe
            setLostBooks(response.data.lostBooks);
        } catch (error) {
            console.error("Error fetching fine data:", error);
        }
    };

    useEffect(() => {
        fetchFinesData();
    }, []);

<<<<<<< HEAD
    const handleFineCalculation = () => {
        setFineAmount(daysDelayed * 50); // Fine rate, e.g., $50 per day
    };

    const handleBookCostCalculation = () => {
        setBookCost(bookCost * 1.5); // E.g., assume lost book cost is 1.5 times its original price
    };
=======
    // Automatically calculate fine amount based on days delayed
    useEffect(() => {
        const fineRate = 50; // Assuming a fine rate of KES 50 per day delayed
        setFineAmount(daysDelayed * fineRate);
    }, [daysDelayed]);

    // Automatically calculate book cost based on original cost
    useEffect(() => {
        setBookCost(parseFloat(costofbook) + 200); // Add 200 KES to the original cost of the book
    }, [costofbook]);

    // Calculate total fines for display
    const totalFines = fines.reduce((total, fine) => total + fine.calculatedFine, 0);
>>>>>>> 7668b226e33eeb1f3fc862063065cf4e8d1ff8fe

    return (
        <div className="content">
            <h2>Manage Fines</h2>

            <div className="total-fines">
                <h3>Total Fines to be Paid: KES {totalFines}</h3> {/* Display total fines */}
            </div>

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
                        </tr>
                    </thead>
                    <tbody>
                        {borrowedBooks.map((book, index) => (
                            <tr key={index}>
<<<<<<< HEAD
                                <td>{book.title}</td>
                                <td>{book.status}</td>
                                <td>${book.fine.toFixed(2)}</td>
                                <td>{book.daysDelayed}</td>
                                <td>{book.paid ? 'Paid' : 'Unpaid'}</td>
=======
                                <td>{fine.title}</td>
                                <td>{fine.returnStatus}</td>
                                <td>{fine.calculatedFine}</td> {/* Display calculated fine in KES */}
                                <td>{fine.daysDelayed}</td>
                                <td><a href="#">view</a></td>
>>>>>>> 7668b226e33eeb1f3fc862063065cf4e8d1ff8fe
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
                            <th>Cost (KES)</th>
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
<<<<<<< HEAD
                <button onClick={handleFineCalculation}>Calculate</button>
                <p>Fine Amount: ${fineAmount.toFixed(2)}</p>
=======
                <p>Fine Amount: KES {fineAmount}</p> {/* Display fine amount in KES */}
>>>>>>> 7668b226e33eeb1f3fc862063065cf4e8d1ff8fe
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
<<<<<<< HEAD
                <button onClick={handleBookCostCalculation}>Calculate Cost to be paid</button>
                <p>Book Cost: ${bookCost.toFixed(2)}</p>
=======
                <p>Book Cost: KES {bookCost}</p> {/* Display book cost in KES */}
>>>>>>> 7668b226e33eeb1f3fc862063065cf4e8d1ff8fe
            </div>
        </div>
    );
};

export default ManageFines;