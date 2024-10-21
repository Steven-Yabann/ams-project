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
            setFines(response.data.borrowedBooks);
            setLostBooks(response.data.lostBooks);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFines();
    }, []);

    const handleFineCalculation = () => {
        setFineAmount(daysDelayed * 50); // Assuming a fine rate of $50 per day delayed
    };

    const handleBookCostCalculation = () => {
        setBookCost(costofbook * 1.5); // Example: Assuming each lost book costs $1000 for now
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
                            <th>Payment History</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fines.map((fine, index) => (
                            <tr key={index}>
                                <td>{fine.title}</td>
                                <td>{fine.returnStatus}</td>
                                <td>{fine.fineAmount}</td>
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
                            <th>Cost</th>
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
                <button onClick={handleFineCalculation}>Calculate</button>
                <p>Fine Amount: ${fineAmount}</p>
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
                <button onClick={handleBookCostCalculation}>Calculate Cost to be paid</button>
                <p>Book Cost: ${bookCost}</p>
            </div>
        </div>
    );
};

export default ManageFines;
