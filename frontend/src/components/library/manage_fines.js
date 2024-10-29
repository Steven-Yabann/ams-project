import React, { useEffect, useState } from 'react';
//import axion
//import axion 
// import '../css_files/manage_fines.css';
const ManageFines = () => {
    const [fines, setFines] = useState([]);
    const [lostBooks, setLostBooks] = useState([]);
    const [costofbook, setcostofbook] = useState(0);
    const [daysDelayed, setDaysDelayed] = useState(0);
    const [fineAmount, setFineAmount] = useState(0);
    const [bookCost, setBookCost] = useState(0);

    const fetchFines = async () => {
        try {
            const response = await bookService.calculateFines();
            const updatedFines = response.data.borrowedBooks.map(fine => {
                const daysDelayed = fine.daysDelayed; // Assuming this is available
                const fineRate = 50; // Assuming a fine rate of KES 50 per day delayed
                const calculatedFine = daysDelayed * fineRate;
                return { ...fine, calculatedFine }; // Add calculated fine to each fine object
            });
            setFines(updatedFines);
            setLostBooks(response.data.lostBooks);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFines();
    }, []);

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
                            <th>Payment History</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fines.map((fine, index) => (
                            <tr key={index}>
                                <td>{fine.title}</td>
                                <td>{fine.returnStatus}</td>
                                <td>{fine.calculatedFine}</td> {/* Display calculated fine in KES */}
                                <td>{fine.daysDelayed}</td>
                                <td><a href="#">view</a></td>
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
                            <th>Payment History</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lostBooks.map((book, index) => (
                            <tr key={index}>
                                <td>{book.title}</td>
                                <td>{book.cost}</td>
                                <td>{book.paid ? 'Yes' : 'No'}</td>
                                <td><a href="#">view</a></td>
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
                <p>Fine Amount: KES {fineAmount}</p> {/* Display fine amount in KES */}
            </div>

            <div className="calculate-book-cost">
                <h3>Calculate Cost of Lost Book</h3>
                <label htmlFor="costofbook">Cost of book lost</label>
                <input 
                    type="number" 
                    id="costofbook" 
                    value={costofbook} 
                    onChange={(e) => setcostofbook(e.target.value)} 
                    placeholder='Cost of book lost'
                />
                <p>Book Cost: KES {bookCost}</p> {/* Display book cost in KES */}
            </div>
        </div>
    );
};

export default ManageFines;