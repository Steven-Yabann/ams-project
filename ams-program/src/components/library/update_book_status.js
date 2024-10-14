import React, { useState } from 'react';
import '../css_files/update_book_status.css';
const UpdateBookStatus = () => {
    const [bookId, setBookId] = useState('');
    const [status, setStatus] = useState('');
    const [isPaid, setIsPaid] = useState(false);
    const [studentInfo, setStudentInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        date: '',
        title: '',
        author: '',
        returnDate: ''
    });

    const handleUpdateStatus = async () => {
        try {
            await bookService.updateStatus(bookId, status, isPaid, studentInfo);
            alert('Book status updated successfully');
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        setStudentInfo({
            ...studentInfo,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className='form-container'>
            <h2>Update Book Status</h2>
            <input
                className='select-input'
                type="text"
                placeholder="Book ID"
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
            />
            <select className="select-status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Select Status</option>
                <option value="Returned">Returned</option>
                <option value="Borrowed">Borrowed</option>
                <option value="Lost">Lost</option>
                <option value="Stolen">Stolen</option>
            </select>
            {status === 'Lost' && (
                <label>
                    <input
                        type="checkbox"
                        checked={isPaid}
                        onChange={() => setIsPaid(!isPaid)}
                    />
                    Mark as Paid
                </label>
            )}
            {status === 'Returned' && (
                <div>
                    <h3>Return Details</h3>
                    <div className='flex-inputs'>
                    <label>
                        First Name
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={studentInfo.firstName}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                    </label>
                    <br/>
                    <label>
                        Last Name
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={studentInfo.lastName}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                    </label>
                    </div>
                    <br/>
                    <div className="flex-inputs">
                    <label>
                        Student Email
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={studentInfo.email}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                    </label>
                    <label> 
                        Admission Number
                    <input
                        type="text"
                        name="studentNumber"
                        placeholder="Student Number"
                        value={studentInfo.studentNumber}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                    </label>
                    </div>
                    <br/>
                    <div className="flex-inputs">
                    <label>
                        Date to be Returned
                    <input
                        type="date"
                        name="datetoReturn"
                        placeholder="Date to be returned"
                        value={studentInfo.datetoReturn}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                    </label>
                    <label>
                        Return Date
                    <input
                        type="date"
                        name="returnDate"
                        placeholder="Return Date"
                        value={studentInfo.returnDate}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                    </label>
                    </div>
                    <br/>
                    <div className="flex-inputs">
                    <label>
                        Book Title
                    <input
                        type="text"
                        name="title"
                        placeholder="Book Title"
                        value={studentInfo.title}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                    </label>
                    <label>
                        Book Author
                    <input
                        type="text"
                        name="author"
                        placeholder="Author"
                        value={studentInfo.author}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                    </label>
                    </div>
                </div>
            )}
            {status === 'Borrowed' && (
                <div>
                    <h3>Borrow Details</h3>
                    <div className="flex-inputs">
                    <label>
                        First Name
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={studentInfo.firstName}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                    </label>
                    <label>
                        Last Name
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={studentInfo.lastName}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                    </label>
                    </div>
                    <br/>
                    <div className="flex-inputs">
                    <label>
                        Student Email
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={studentInfo.email}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                    </label>
                    <label>
                        Admission Number
                    <input
                        type="text"
                        name="studentNumber"
                        placeholder="Student Number"
                        value={studentInfo.studentNumber}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                    </label>
                    </div>
                    <br/>
                    <div className="flex-inputs">
                    <label>
                        Borrow Date
                    <input
                        type="date"
                        name="date"
                        placeholder="Borrow Date"
                        value={studentInfo.date}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                    </label>
                    <label>
                        Date to be Returned
                    <input
                        type="date"
                        name="datetoReturn"
                        placeholder="Date to be Returned"
                        value={studentInfo.datetoReturn}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                    </label>
                    </div>
                    <br/>
                    <div className="flex-inputs">
                    <label>
                        Book Title
                    <input
                        type="text"
                        name="title"
                        placeholder="Book Title"
                        value={studentInfo.title}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                    </label>
                    <label>
                        Book Author 
                    <input
                        type="text"
                        name="author"
                        placeholder="Author"
                        value={studentInfo.author}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                    </label>
                    </div>
                </div>
            )}
            <button className="submit-btn" onClick={handleUpdateStatus}>Update Status</button>
        </div>
    );
};

export default UpdateBookStatus;
